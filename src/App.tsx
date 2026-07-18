import { useMemo, useRef, useState } from 'react';
import { ChinaMap } from './components/ChinaMap';
import { FoodModal } from './components/FoodModal';
import { TasteFilmCarousel } from './components/TasteFilmCarousel';
import { DialectSpeaker } from './domain/dialectAudio';
import {
  Food,
  getDefaultProvince,
  getProvinceByName,
  Province,
  provinces
} from './domain/provinces';

export function App() {
  const [selectedProvince, setSelectedProvince] = useState<Province>(getDefaultProvince());
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [notice, setNotice] = useState('点击省份，听见地方味道。');
  const [isProvinceFocused, setIsProvinceFocused] = useState(false);
  const speakerRef = useRef<DialectSpeaker | null>(null);

  const selectedFoodIds = useMemo(
    () => selectedProvince.foods.map((food) => food.id).join(','),
    [selectedProvince]
  );

  function selectProvince(name: string) {
    const province = getProvinceByName(name);

    if (!province) {
      setNotice(`${name} 的内容正在整理中。`);
      return;
    }

    setSelectedProvince(province);
    setIsProvinceFocused(true);
    setNotice(`${province.name}：${province.dialect.label}正在播放。`);

    speakerRef.current ??= new DialectSpeaker();
    if (!speakerRef.current.speak(province.dialect.phrase)) {
      setNotice(`${province.name} 已选中，当前浏览器不支持语音播放。`);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar" aria-label="项目标题">
        <div>
          <p className="kicker">舌尖上的中国 · 地图探索</p>
          <h1>A Bite of China</h1>
        </div>
        <button
          className="ghost-button"
          type="button"
          onClick={() => {
            setSelectedProvince(getDefaultProvince());
            setIsProvinceFocused(false);
            setNotice('已回到默认全国视图，从四川开始探索。');
          }}
        >
          返回全国
        </button>
      </header>

      <section className="hero-map" aria-label="中国美食地图">
        <ChinaMap
          selectedProvince={selectedProvince}
          isProvinceFocused={isProvinceFocused}
          onSelectProvince={selectProvince}
        />
        <div className="province-panel" aria-live="polite">
          <span>{selectedProvince.name}</span>
          <strong>{selectedProvince.dialect.label}</strong>
          <p>{notice}</p>
          <div className="province-shortcuts" aria-label="已收录省份">
            {provinces.map((province) => (
              <button
                key={province.id}
                type="button"
                onClick={() => selectProvince(province.name)}
                aria-pressed={isProvinceFocused && province.id === selectedProvince.id}
              >
                {province.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <TasteFilmCarousel
        key={selectedFoodIds}
        province={selectedProvince}
        onSelectFood={setSelectedFood}
      />

      <FoodModal food={selectedFood} onClose={() => setSelectedFood(null)} />
    </main>
  );
}
