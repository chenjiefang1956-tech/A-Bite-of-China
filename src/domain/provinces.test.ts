import { describe, expect, it } from 'vitest';
import { getDefaultProvince, getProvinceByName, getVisibleCityLabels, provinces } from './provinces';

const findProvinceById = (id: string) => provinces.find((province) => province.id === id);

describe('province data', () => {
  it('uses Sichuan as the default immersive entry', () => {
    expect(getDefaultProvince().id).toBe('sichuan');
  });

  it('syncs the page data from the A Bite of China food table', () => {
    const province = findProvinceById('guangdong');

    expect(provinces.length).toBeGreaterThan(20);
    expect(province?.cities).toContain('广州市');
    expect(province?.cities).toContain('珠海市');
    expect(province?.foods.map((food) => food.name)).toContain('广州早茶');
    expect(province?.foods.find((food) => food.name === '广州早茶')?.sourceStatus).toBe('listed');
    expect(province?.dialect.phrase).toContain('食');
  });

  it('keeps Guangdong city data but displays the requested map labels', () => {
    const province = findProvinceById('guangdong');

    expect(province?.cities).toEqual(expect.arrayContaining(['广州市', '珠海市']));
    expect(province && getVisibleCityLabels(province)).toEqual(['勇', '欣']);
  });

  it('only exposes mapped food rows that are suitable for the map experience', () => {
    const pageFoods = provinces.flatMap((province) => province.foods);

    expect(pageFoods.length).toBeGreaterThan(150);
    expect(pageFoods.every((food) => ['high', 'medium'].includes(food.locationConfidence))).toBe(
      true
    );
    expect(pageFoods.every((food) => food.province.length > 0)).toBe(true);
  });

  it('removes duplicated food names from the page data', () => {
    const foodNames = provinces.flatMap((province) => province.foods.map((food) => food.name));
    const uniqueFoodNames = new Set(foodNames);

    expect(foodNames.length).toBe(uniqueFoodNames.size);
  });

  it('uses real image URLs for the first Sichuan film cards', () => {
    const province = findProvinceById('sichuan');
    const firstCards = province?.foods.slice(0, 3) ?? [];
    const tengjiaoFish = firstCards.find((food) => food.id === 's1e6-tengjiao-fish');

    expect(firstCards.map((food) => food.id)).toEqual([
      's1e6-yuxiang',
      's1e6-mapo-tofu',
      's1e6-tengjiao-fish'
    ]);
    expect(firstCards.every((food) => food.hasImage)).toBe(true);
    expect(tengjiaoFish?.image).toBe('/food-images-webp/s1e6-tengjiao-fish.webp');
    expect(tengjiaoFish?.imageSourceName).toBe('项目本地素材');
  });

  it('fills every matched food image from encyclopedia or local sources', () => {
    const foodsWithImages = provinces
      .flatMap((province) => province.foods)
      .filter((food) => food.hasImage);

    expect(foodsWithImages.length).toBe(210);
    expect(
      foodsWithImages.every(
        (food) =>
          food.imageSourceUrl.startsWith('https://') ||
          food.imageSourceUrl.startsWith('/food-images-webp/')
      )
    ).toBe(true);
  });

  it('uses locally prepared images for matched missing foods', () => {
    const province = findProvinceById('yunnan');
    const matsutake = province?.foods.find((food) => food.id === 's1e1-songrong');

    expect(matsutake?.image).toBe('/food-images-webp/s1e1-songrong.webp');
    expect(matsutake?.imageSourceName).toBe('项目本地素材');
  });

  it('uses the locally prepared image for pork belly chicken', () => {
    const province = findProvinceById('guangdong');
    const porkBellyChicken = province?.foods.find((food) => food.id === 's3e4-porkbelly-chicken');

    expect(porkBellyChicken?.image).toBe('/food-images-webp/s3e4-porkbelly-chicken.webp');
    expect(porkBellyChicken?.imageSourceName).toBe('项目本地素材');
  });

  it('returns undefined for an unsupported province name', () => {
    expect(getProvinceByName('不存在')).toBeUndefined();
  });

  it('returns visible labels for the selected province cities', () => {
    const province = findProvinceById('sichuan');

    expect(province && getVisibleCityLabels(province)).toContain('成都市');
  });
});
