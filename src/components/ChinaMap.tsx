import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { getCityMarkers, Province, provinces } from '../domain/provinces';

type ChinaMapProps = {
  selectedProvince: Province;
  isProvinceFocused: boolean;
  onSelectProvince: (name: string) => void;
};

const mapUrl = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';
const chinaCenter: [number, number] = [104.2, 35.8];

export function ChinaMap({ selectedProvince, isProvinceFocused, onSelectProvince }: ChinaMapProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      try {
        const response = await fetch(mapUrl);
        if (!response.ok) {
          throw new Error(`map fetch failed: ${response.status}`);
        }
        const geoJson = await response.json();
        if (!cancelled) {
          echarts.registerMap('china', geoJson);
          setMapReady(true);
        }
      } catch {
        if (!cancelled) {
          setMapError('中国地图数据暂时无法加载，请检查网络后刷新。');
        }
      }
    }

    loadMap();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !mapReady) {
      return;
    }

    instanceRef.current = echarts.init(chartRef.current, undefined, {
      renderer: 'canvas'
    });

    const resize = () => instanceRef.current?.resize();
    window.addEventListener('resize', resize);
    instanceRef.current.on('click', (params) => {
      if (typeof params.name === 'string') {
        onSelectProvince(params.name);
      }
    });

    return () => {
      window.removeEventListener('resize', resize);
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, [mapReady, onSelectProvince]);

  useEffect(() => {
    if (!instanceRef.current || !mapReady) {
      return;
    }

    const configuredNames = new Set(provinces.map((province) => province.name));
    const cityMarkers = isProvinceFocused
      ? getCityMarkers(selectedProvince).filter((marker) => marker.value)
      : [];

    instanceRef.current.setOption(
      {
        backgroundColor: 'transparent',
        animationDurationUpdate: 900,
        animationEasingUpdate: 'cubicOut',
        tooltip: {
          trigger: 'item',
          formatter: (params: { name?: string }) =>
            configuredNames.has(params.name ?? '')
              ? `${params.name}<br/>点击进入味觉胶片`
              : `${params.name}<br/>内容正在整理中`
        },
        geo: {
          map: 'china',
          roam: false,
          center: isProvinceFocused ? selectedProvince.center : chinaCenter,
          zoom: isProvinceFocused ? selectedProvince.zoom : 1.2,
          scaleLimit: { min: 1, max: 5 },
          itemStyle: {
            areaColor: '#2e3b33',
            borderColor: 'rgba(236, 218, 162, 0.58)',
            borderWidth: 0.8
          },
          emphasis: {
            itemStyle: {
              areaColor: '#b84a34',
              borderColor: '#f6df9a',
              borderWidth: 1.4
            },
            label: {
              color: '#fff'
            }
          },
          regions: isProvinceFocused
            ? [
                {
                  name: selectedProvince.name,
                  itemStyle: {
                    areaColor: '#d35a38',
                    borderColor: '#fff0b8',
                    borderWidth: 1.6,
                    shadowBlur: 24,
                    shadowColor: 'rgba(211, 90, 56, 0.55)'
                  },
                  label: {
                    show: true,
                    color: '#fff',
                    fontWeight: 700
                  }
                }
              ]
            : []
        },
        series: [
          {
            name: '省份',
            type: 'map',
            map: 'china',
            geoIndex: 0,
            selectedMode: false,
            data: provinces.map((province) => ({
              name: province.name,
              value: province.name === selectedProvince.name ? 10 : 1
            })),
            itemStyle: {
              opacity: isProvinceFocused ? 0.38 : 0.7
            }
          },
          {
            name: '城市标注',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'circle',
            symbolSize: 10,
            data: cityMarkers,
            label: {
              show: true,
              formatter: '{b}',
              position: 'right',
              color: '#f8efd0',
              fontSize: 15,
              fontWeight: 700,
              textShadowBlur: 8,
              textShadowColor: '#000'
            },
            itemStyle: {
              color: '#f0c66a',
              shadowBlur: 12,
              shadowColor: 'rgba(240, 198, 106, 0.8)'
            },
            zlevel: 2
          }
        ]
      },
      true
    );
  }, [isProvinceFocused, mapReady, selectedProvince]);

  return (
    <div className="map-wrap">
      <div ref={chartRef} className="map-canvas" aria-label="可交互中国地图" />
      {!mapReady && !mapError ? <div className="map-status">正在加载中国地图...</div> : null}
      {mapError ? <div className="map-status map-error">{mapError}</div> : null}
    </div>
  );
}
