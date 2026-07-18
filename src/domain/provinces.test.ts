import { describe, expect, it } from 'vitest';
import {
  getDefaultProvince,
  getProvinceByName,
  getVisibleCityLabels
} from './provinces';

describe('province data', () => {
  it('uses Sichuan as the default immersive entry', () => {
    expect(getDefaultProvince().name).toBe('四川');
  });

  it('finds a province with cities, foods, and a dialect phrase', () => {
    const province = getProvinceByName('广东');

    expect(province?.cities).toContain('广州市');
    expect(province?.cities).toContain('珠海市');
    expect(province?.foods.map((food) => food.name)).toContain('早茶');
    expect(province?.dialect.phrase).toContain('食');
  });

  it('replaces Guangdong city labels with the requested display words', () => {
    const province = getProvinceByName('广东');

    expect(province && getVisibleCityLabels(province)).toEqual(['勇', '欣']);
  });

  it('returns undefined for an unsupported province name', () => {
    expect(getProvinceByName('不存在')).toBeUndefined();
  });
});
