import { useMemo, useRef, useState } from 'react';
import { ChinaMap } from './components/ChinaMap';
import { FoodModal } from './components/FoodModal';
import { TasteFilmCarousel } from './components/TasteFilmCarousel';
import { DialectSpeaker } from './domain/dialectAudio';
import { Food, getDefaultProvince, getProvinceByName, Province } from './domain/provinces';

export function App() {
  const [selectedProvince, setSelectedProvince] = useState<Province>(getDefaultProvince());
  const [isProvinceFocused, setIsProvinceFocused] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const speakerRef = useRef<DialectSpeaker | null>(null);

  const selectedFoodIds = useMemo(
    () => selectedProvince.foods.map((food) => food.id).join(','),
    [selectedProvince]
  );

  function selectProvince(name: string) {
    const province = getProvinceByName(name);

    if (!province) {
      return;
    }

    setSelectedProvince(province);
    setIsProvinceFocused(true);

    speakerRef.current ??= new DialectSpeaker();
    speakerRef.current.speak(province.dialect.phrase);
  }

  function resetMap() {
    setSelectedProvince(getDefaultProvince());
    setIsProvinceFocused(false);
    setSelectedFood(null);
    speakerRef.current?.speak('已返回全国视图，从中国地图继续探索。');
  }

  return (
    <main className="app-shell">
      <header className="topbar" aria-label="项目标题">
        <div>
          <p className="kicker">舌尖上的中国 · 地图探索</p>
          <h1>A Bite of China</h1>
        </div>
        <button className="ghost-button" type="button" onClick={resetMap}>
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
          <span>{isProvinceFocused ? selectedProvince.name : '中国'}</span>
          <strong>
            {isProvinceFocused
              ? `${selectedProvince.dialect.label} · ${selectedProvince.foods.length} 条节目美食`
              : '点击地图省份开始探索'}
          </strong>
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
