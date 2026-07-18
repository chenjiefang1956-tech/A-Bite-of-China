import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Food } from '../domain/provinces';
import { FoodModal } from './FoodModal';

const food: Food = {
  id: 's3e4-porkbelly-chicken',
  name: '猪肚鸡',
  province: '广东',
  city: '广东',
  regionText: '广东',
  category: '汤羹',
  image: '/food-images-webp/s3e4-porkbelly-chicken.webp',
  imageAlt: '猪肚鸡',
  imageSourceName: '项目本地素材',
  imageSourceUrl: '/food-images-webp/s3e4-porkbelly-chicken.webp',
  hasImage: true,
  description: '第三季第四集登场美食。',
  season: 3,
  episode: 4,
  episodeTitle: '养',
  sourceName: '维基百科《舌尖上的中国》',
  sourceUrl: 'https://zh.wikipedia.org/wiki/舌尖上的中国',
  sourceStatus: 'listed',
  locationConfidence: 'medium'
};

describe('FoodModal', () => {
  it('shows image information next to the food detail image', () => {
    render(<FoodModal food={food} onClose={vi.fn()} />);

    expect(screen.getByRole('img', { name: '猪肚鸡' })).toBeInTheDocument();
    expect(screen.getByText('图片信息：项目本地素材')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '查看图片来源' })).toHaveAttribute(
      'href',
      '/food-images-webp/s3e4-porkbelly-chicken.webp'
    );
  });
});
