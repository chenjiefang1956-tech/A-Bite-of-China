import foodsCsv from '../../docs/a-bite-of-china-foods.csv?raw';
import { foodImages } from './foodImages';

export type SourceStatus = 'listed' | 'mentioned' | 'official-mentioned';
export type LocationConfidence = 'high' | 'medium' | 'low';

export type Food = {
  id: string;
  name: string;
  province: string;
  city: string;
  regionText: string;
  category: string;
  image: string;
  imageAlt: string;
  imageSourceName: string;
  imageSourceUrl: string;
  hasImage: boolean;
  description: string;
  season: number;
  episode: number;
  episodeTitle: string;
  sourceName: string;
  sourceUrl: string;
  sourceStatus: SourceStatus;
  locationConfidence: Exclude<LocationConfidence, 'low'>;
};

export type CityLabel = {
  city: string;
  label: string;
  coord: [number, number];
};

export type Province = {
  id: string;
  name: string;
  center: [number, number];
  zoom: number;
  cities: string[];
  cityLabels?: CityLabel[];
  dialect: {
    label: string;
    phrase: string;
  };
  foods: Food[];
};

type FoodRow = {
  id: string;
  season: string;
  episode: string;
  episodeTitle: string;
  foodName: string;
  province: string;
  city: string;
  regionText: string;
  category: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  audioUrl: string;
  sourceName: string;
  sourceUrl: string;
  sourceStatus: SourceStatus;
  locationConfidence: LocationConfidence;
};

const provinceMeta: Record<
  string,
  {
    id: string;
    center: [number, number];
    zoom: number;
    dialect: Province['dialect'];
  }
> = {
  北京: {
    id: 'beijing',
    center: [116.4, 39.9],
    zoom: 4.1,
    dialect: { label: '北京话', phrase: '您吃了吗？今儿咱就从这口热乎的开始。' }
  },
  天津: {
    id: 'tianjin',
    center: [117.2, 39.1],
    zoom: 4.3,
    dialect: { label: '天津话', phrase: '介味儿倍儿地道，您尝尝就知道。' }
  },
  河北: {
    id: 'hebei',
    center: [114.5, 38.0],
    zoom: 2.8,
    dialect: { label: '冀鲁官话', phrase: '家常饭最实在，热乎着吃。' }
  },
  山西: {
    id: 'shanxi',
    center: [112.6, 37.8],
    zoom: 2.85,
    dialect: { label: '晋语', phrase: '来上一碗面，筋道得很。' }
  },
  内蒙古: {
    id: 'inner-mongolia',
    center: [111.7, 40.8],
    zoom: 2.0,
    dialect: { label: '蒙古语与晋语区', phrase: '草原上的奶香和肉香，都在这一口里。' }
  },
  辽宁: {
    id: 'liaoning',
    center: [123.4, 41.8],
    zoom: 2.75,
    dialect: { label: '东北官话', phrase: '这海味儿老鲜了，趁热整点儿。' }
  },
  吉林: {
    id: 'jilin',
    center: [126.5, 43.9],
    zoom: 2.75,
    dialect: { label: '东北官话', phrase: '冰湖里的鱼鲜，冬天吃最有劲儿。' }
  },
  黑龙江: {
    id: 'heilongjiang',
    center: [127.9, 46.7],
    zoom: 2.45,
    dialect: { label: '东北官话', phrase: '大锅一炖，香味儿就起来了。' }
  },
  上海: {
    id: 'shanghai',
    center: [121.47, 31.23],
    zoom: 4.6,
    dialect: { label: '上海话', phrase: '这点味道蛮灵额，慢慢品。' }
  },
  江苏: {
    id: 'jiangsu',
    center: [118.8, 32.1],
    zoom: 3.0,
    dialect: { label: '江淮官话与吴语', phrase: '刀工火候都要细，鲜味才稳。' }
  },
  浙江: {
    id: 'zhejiang',
    center: [120.2, 30.3],
    zoom: 3.1,
    dialect: { label: '吴语', phrase: '这一口鲜得来，刚刚好。' }
  },
  安徽: {
    id: 'anhui',
    center: [117.3, 31.8],
    zoom: 2.95,
    dialect: { label: '江淮官话与徽语', phrase: '慢慢烧，香味才进得去。' }
  },
  福建: {
    id: 'fujian',
    center: [119.3, 26.1],
    zoom: 2.9,
    dialect: { label: '闽语', phrase: '山海之间，味道有清也有浓。' }
  },
  江西: {
    id: 'jiangxi',
    center: [115.9, 28.7],
    zoom: 2.9,
    dialect: { label: '赣语', phrase: '饭菜要入味，火候要守住。' }
  },
  山东: {
    id: 'shandong',
    center: [117.0, 36.7],
    zoom: 2.75,
    dialect: { label: '胶辽官话与冀鲁官话', phrase: '鲜咸讲究个正，锅气也得足。' }
  },
  河南: {
    id: 'henan',
    center: [113.6, 34.8],
    zoom: 2.85,
    dialect: { label: '中原官话', phrase: '中不中？这一碗可得趁热吃。' }
  },
  湖北: {
    id: 'hubei',
    center: [114.3, 30.6],
    zoom: 2.85,
    dialect: { label: '西南官话', phrase: '过早也好，蒸菜也好，味道要扎实。' }
  },
  湖南: {
    id: 'hunan',
    center: [112.9, 28.2],
    zoom: 2.8,
    dialect: { label: '湘语', phrase: '恰饭咯，香辣味一上来就醒神。' }
  },
  广东: {
    id: 'guangdong',
    center: [113.35, 23.1],
    zoom: 2.85,
    dialect: { label: '粤语与潮汕话', phrase: '食咗饭未？饮啖茶先。' }
  },
  广西: {
    id: 'guangxi',
    center: [108.3, 22.8],
    zoom: 2.8,
    dialect: { label: '西南官话与壮语区', phrase: '酸香开胃，山海的味道都在里头。' }
  },
  海南: {
    id: 'hainan',
    center: [110.3, 20.0],
    zoom: 3.6,
    dialect: { label: '海南话', phrase: '靠海吃海，鲜味最要紧。' }
  },
  重庆: {
    id: 'chongqing',
    center: [106.55, 29.56],
    zoom: 3.1,
    dialect: { label: '重庆话', phrase: '巴适得很，麻辣鲜香都到位。' }
  },
  四川: {
    id: 'sichuan',
    center: [103.9, 30.6],
    zoom: 2.45,
    dialect: { label: '四川话', phrase: '巴适得板，安逸得很。' }
  },
  贵州: {
    id: 'guizhou',
    center: [106.7, 26.6],
    zoom: 2.85,
    dialect: { label: '西南官话与苗侗语区', phrase: '酸汤一滚，香气就醒了。' }
  },
  云南: {
    id: 'yunnan',
    center: [102.7, 25.05],
    zoom: 2.45,
    dialect: { label: '云南话', phrase: '给是想整碗米线？菌子也鲜得很。' }
  },
  西藏: {
    id: 'tibet',
    center: [91.1, 29.7],
    zoom: 2.1,
    dialect: { label: '藏语区', phrase: '青稞和酥油，是高原上的日常味道。' }
  },
  陕西: {
    id: 'shaanxi',
    center: [108.95, 34.27],
    zoom: 2.65,
    dialect: { label: '关中话', phrase: '咥一碗面，舒坦得很。' }
  },
  甘肃: {
    id: 'gansu',
    center: [103.8, 36.1],
    zoom: 2.35,
    dialect: { label: '兰银官话', phrase: '一清二白三红四绿，面香就来了。' }
  },
  宁夏: {
    id: 'ningxia',
    center: [106.3, 38.5],
    zoom: 3.1,
    dialect: { label: '兰银官话', phrase: '手擀出来的筋道，最能留住家常味。' }
  },
  新疆: {
    id: 'xinjiang',
    center: [87.6, 43.8],
    zoom: 1.85,
    dialect: { label: '维吾尔语与中原官话', phrase: '馕香、肉香和果香，都是远方的味道。' }
  },
  香港: {
    id: 'hong-kong',
    center: [114.17, 22.32],
    zoom: 4.7,
    dialect: { label: '粤语', phrase: '大澳海风里，咸鲜味慢慢发酵。' }
  },
  澳门: {
    id: 'macau',
    center: [113.55, 22.2],
    zoom: 4.8,
    dialect: { label: '粤语', phrase: '甜品慢慢食，陈皮香最耐品。' }
  },
  台湾: {
    id: 'taiwan',
    center: [121.0, 23.7],
    zoom: 2.75,
    dialect: { label: '闽南语', phrase: '一碗饭一尾鱼，家常味道最实在。' }
  }
};

const provinceOrder = [
  '四川',
  '广东',
  '云南',
  '陕西',
  '江苏',
  '浙江',
  '山东',
  '安徽',
  '湖南',
  '湖北',
  '福建',
  '新疆',
  '北京',
  '内蒙古',
  '贵州',
  '山西',
  '重庆',
  '上海',
  '广西',
  '河南',
  '黑龙江',
  '台湾',
  '澳门',
  '吉林',
  '西藏',
  '甘肃',
  '辽宁',
  '天津',
  '宁夏',
  '香港',
  '海南'
];

const provinceCityOverrides: Partial<
  Record<string, Pick<Province, 'cities' | 'cityLabels'>>
> = {
  广东: {
    cities: ['广州市', '珠海市'],
    cityLabels: [
      { city: '广州市', label: '勇', coord: [113.26, 23.13] },
      { city: '珠海市', label: '欣', coord: [113.58, 22.27] }
    ]
  }
};

const fallbackFoodImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560">
  <rect width="900" height="560" fill="#1d211b"/>
  <rect x="54" y="54" width="792" height="452" rx="18" fill="#2f3429" stroke="#d6c690" stroke-opacity=".35" stroke-width="2"/>
  <circle cx="450" cy="260" r="118" fill="#b84a34" opacity=".88"/>
  <circle cx="450" cy="260" r="74" fill="#f0c66a" opacity=".72"/>
  <path d="M210 388h480" stroke="#f5ecd9" stroke-opacity=".5" stroke-width="10" stroke-linecap="round"/>
  <text x="450" y="456" text-anchor="middle" fill="#f5ecd9" font-size="44" font-family="Microsoft YaHei, sans-serif">舌尖风味</text>
</svg>`);

const rows = dedupeRowsByFoodName(parseCsv<FoodRow>(foodsCsv));

export const provinces: Province[] = provinceOrder
  .map((provinceName) => buildProvince(provinceName, rows))
  .filter((province): province is Province => Boolean(province));

export function getDefaultProvince() {
  return getProvinceByName('四川') ?? provinces[0];
}

export function getProvinceByName(name: string) {
  const normalizedName = normalizeProvinceName(name);
  return provinces.find((province) => province.name === normalizedName);
}

export function getVisibleCityLabels(province: Province) {
  if (province.cityLabels?.length) {
    return province.cityLabels.map((city) => city.label);
  }

  return province.cities;
}

const cityCoords: Record<string, [number, number]> = {
  北京市: [116.4, 39.9],
  天津市: [117.2, 39.1],
  上海市: [121.47, 31.23],
  重庆市: [106.55, 29.56],
  成都市: [104.06, 30.67],
  宜宾市: [104.64, 28.75],
  乐山市: [103.76, 29.55],
  凉山彝族自治州: [102.27, 27.88],
  广州市: [113.26, 23.13],
  汕头市: [116.68, 23.35],
  江门市: [113.08, 22.58],
  佛山市: [113.12, 23.02],
  香格里拉市: [99.71, 27.83],
  大理白族自治州: [100.27, 25.61],
  建水县: [102.83, 23.63],
  石屏县: [102.49, 23.71],
  昆明市: [102.83, 24.88],
  西双版纳傣族自治州: [100.8, 22.0],
  西安市: [108.94, 34.34],
  绥德县: [110.26, 37.5],
  岐山县: [107.62, 34.44],
  汉中市: [107.02, 33.07],
  蓝田县: [109.32, 34.15],
  榆林市: [109.73, 38.29],
  富平县: [109.18, 34.75],
  兰州市: [103.84, 36.06],
  扬州市: [119.41, 32.39],
  无锡市: [120.31, 31.49],
  镇江市: [119.45, 32.2],
  靖江市: [120.27, 32.02],
  兴化市: [119.85, 32.91],
  苏州市: [120.58, 31.3],
  淮安市: [119.02, 33.61],
  泰州市: [119.92, 32.46],
  遂昌县: [119.28, 28.59],
  绍兴市: [120.58, 30.03],
  金华市: [119.65, 29.08],
  杭州市: [120.15, 30.27],
  湖州市: [120.08, 30.89],
  台州市: [121.42, 28.66],
  宁波市: [121.55, 29.87],
  黄山市: [118.34, 29.72],
  寿县: [116.79, 32.58],
  休宁县: [118.2, 29.79],
  泉州市: [118.68, 24.87],
  霞浦县: [120.0, 26.89],
  济南市: [117.12, 36.65],
  胶州市: [120.03, 36.26],
  青岛市: [120.38, 36.07],
  郓城县: [115.94, 35.6],
  开封市: [114.31, 34.8],
  武汉市: [114.31, 30.52],
  天门市: [113.17, 30.66],
  嘉鱼县: [113.92, 29.97],
  仙桃市: [113.45, 30.36],
  靖州苗族侗族自治县: [109.68, 26.58],
  长沙市: [112.94, 28.23],
  湘乡市: [112.53, 27.73],
  平江县: [113.58, 28.7],
  雷山县: [108.08, 26.38],
  黎平县: [109.14, 26.23],
  贵阳市: [106.63, 26.65],
  北海市: [109.12, 21.48],
  钦州市: [108.65, 21.98],
  大连市: [121.61, 38.91],
  松原市: [124.82, 45.13],
  依兰县: [129.57, 46.32],
  锡林郭勒盟: [116.05, 43.93],
  库车市: [82.96, 41.72],
  从江县: [108.9, 25.75],
  嘉兴市: [120.76, 30.75],
  宁波滩涂: [121.55, 29.87],
  台南市: [120.2, 22.99],
  云林县: [120.54, 23.71],
  香港: [114.17, 22.32],
  澳门: [113.55, 22.2]
};

export function getCityMarkers(province: Province) {
  return province.cities.map((city) => {
    const override = province.cityLabels?.find((item) => item.city === city);

    return {
      name: override?.label ?? city,
      city,
      value: override?.coord ?? cityCoords[city]
    };
  });
}

function buildProvince(provinceName: string, allRows: FoodRow[]): Province | undefined {
  const meta = provinceMeta[provinceName];
  if (!meta) {
    return undefined;
  }

  const foods = allRows
    .filter((row) => {
      return (
        normalizeProvinceName(row.province) === provinceName &&
        row.locationConfidence !== 'low' &&
        row.foodName.length > 0
      );
    })
    .map((row): Food => {
      const city = row.city || getRegionCity(row.regionText) || provinceName;
      const image = getFoodImage(row);

      return {
        id: row.id,
        name: row.foodName,
        province: provinceName,
        city,
        regionText: row.regionText,
        category: row.category,
        image: image.url,
        imageAlt: row.imageAlt || row.foodName,
        imageSourceName: image.sourceName,
        imageSourceUrl: image.sourceUrl,
        hasImage: image.hasImage,
        description: `${row.description}（第${row.season}季第${row.episode}集《${row.episodeTitle}》）`,
        season: Number(row.season),
        episode: Number(row.episode),
        episodeTitle: row.episodeTitle,
        sourceName: row.sourceName,
        sourceUrl: row.sourceUrl,
        sourceStatus: row.sourceStatus,
        locationConfidence: row.locationConfidence as Exclude<LocationConfidence, 'low'>
      };
    });

  if (!foods.length) {
    return undefined;
  }

  const cityOverride = provinceCityOverrides[provinceName];
  const cities = cityOverride?.cities ?? unique(foods.map((food) => food.city)).slice(0, 12);

  return {
    id: meta.id,
    name: provinceName,
    center: meta.center,
    zoom: meta.zoom,
    cities,
    ...(cityOverride?.cityLabels ? { cityLabels: cityOverride.cityLabels } : {}),
    dialect: meta.dialect,
    foods
  };
}

function getFoodImage(row: FoodRow) {
  if (row.imageUrl) {
    return {
      url: row.imageUrl,
      sourceName: '项目数据表图片',
      sourceUrl: row.imageUrl,
      hasImage: true
    };
  }

  const mappedImage = foodImages[row.id];
  if (mappedImage) {
    return {
      url: mappedImage.url,
      sourceName: mappedImage.sourceName,
      sourceUrl: mappedImage.sourceUrl,
      hasImage: true
    };
  }

  return {
    url: fallbackFoodImage,
    sourceName: '',
    sourceUrl: '',
    hasImage: false
  };
}

function dedupeRowsByFoodName(foodRows: FoodRow[]) {
  const seenNames = new Set<string>();

  return foodRows.filter((row) => {
    const normalizedName = row.foodName.trim();

    if (!normalizedName) {
      return true;
    }

    if (seenNames.has(normalizedName)) {
      return false;
    }

    seenNames.add(normalizedName);
    return true;
  });
}

function parseCsv<T extends Record<string, string>>(csv: string) {
  const [headerLine, ...lines] = csv.trim().split(/\r?\n/);
  const headers = parseCsvLine(headerLine);

  return lines.map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce(
      (row, header, index) => {
        row[header] = values[index] ?? '';
        return row;
      },
      {} as Record<string, string>
    ) as T;
  });
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === ',' && !quoted) {
      values.push(value);
      value = '';
      continue;
    }

    value += char;
  }

  values.push(value);
  return values;
}

function normalizeProvinceName(name: string) {
  return name
    .replace('维吾尔自治区', '')
    .replace('壮族自治区', '')
    .replace('回族自治区', '')
    .replace('自治区', '')
    .replace('特别行政区', '')
    .replace(/省$|市$/u, '');
}

function getRegionCity(regionText: string) {
  if (!regionText || regionText === '多地' || regionText === '未明确') {
    return '';
  }

  return regionText
    .replace(/^浙江|^云南|^陕西|^江苏|^广东|^安徽|^湖南|^湖北|^福建|^山东|^贵州|^四川|^新疆|^内蒙古|^广西/u, '')
    .trim();
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}
