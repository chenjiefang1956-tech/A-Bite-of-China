export type Food = {
  id: string;
  name: string;
  city: string;
  image: string;
  description: string;
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

export const provinces: Province[] = [
  {
    id: 'sichuan',
    name: '四川',
    center: [103.9, 30.6],
    zoom: 2.25,
    cities: ['成都市', '乐山市', '宜宾市'],
    dialect: {
      label: '四川话',
      phrase: '巴适得板，安逸得很。'
    },
    foods: [
      {
        id: 'mapo-tofu',
        name: '麻婆豆腐',
        city: '成都市',
        image:
          'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80',
        description: '豆腐细嫩，麻辣鲜香，是川味中最有辨识度的家常名菜之一。'
      },
      {
        id: 'leshan-bobo',
        name: '钵钵鸡',
        city: '乐山市',
        image:
          'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=900&q=80',
        description: '竹签串起冷食小菜，红油汤底带出乐山街头的烟火气。'
      },
      {
        id: 'yibin-noodle',
        name: '宜宾燃面',
        city: '宜宾市',
        image:
          'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=900&q=80',
        description: '面条干香利落，芽菜、花生和辣椒油构成鲜明层次。'
      }
    ]
  },
  {
    id: 'guangdong',
    name: '广东',
    center: [113.35, 23.1],
    zoom: 2.55,
    cities: ['广州市', '珠海市'],
    cityLabels: [
      { city: '广州市', label: '勇', coord: [113.26, 23.13] },
      { city: '珠海市', label: '欣', coord: [113.58, 22.27] }
    ],
    dialect: {
      label: '粤语',
      phrase: '食咗饭未？饮啖茶先。'
    },
    foods: [
      {
        id: 'dim-sum',
        name: '早茶',
        city: '广州市',
        image:
          'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=80',
        description: '一盅两件，点心、茶香和慢节奏构成广州日常的味觉秩序。'
      },
      {
        id: 'roast-goose',
        name: '烧鹅',
        city: '广州市',
        image:
          'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
        description: '皮脆肉嫩，梅子酱收住油脂，是岭南烧腊的代表风味。'
      },
      {
        id: 'zhuhai-seafood',
        name: '珠海海鲜',
        city: '珠海市',
        image:
          'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=900&q=80',
        description: '近海而食，清蒸与白灼强调食材鲜度和南方海岸气息。'
      }
    ]
  },
  {
    id: 'yunnan',
    name: '云南',
    center: [102.7, 25.05],
    zoom: 2.35,
    cities: ['昆明市', '大理市', '建水县'],
    dialect: {
      label: '云南话',
      phrase: '给是想整碗米线？'
    },
    foods: [
      {
        id: 'crossing-noodle',
        name: '过桥米线',
        city: '昆明市',
        image:
          'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
        description: '滚汤、米线与配料分置，入口时完成一场热气腾腾的组合。'
      },
      {
        id: 'steam-pot-chicken',
        name: '汽锅鸡',
        city: '建水县',
        image:
          'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=900&q=80',
        description: '以蒸汽凝汤，鸡肉鲜甜，体现云南对本味的细致保留。'
      }
    ]
  },
  {
    id: 'shaanxi',
    name: '陕西',
    center: [108.95, 34.27],
    zoom: 2.25,
    cities: ['西安市', '宝鸡市', '汉中市'],
    dialect: {
      label: '关中话',
      phrase: '咥一碗面，舒坦得很。'
    },
    foods: [
      {
        id: 'roujiamo',
        name: '肉夹馍',
        city: '西安市',
        image:
          'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
        description: '馍酥肉烂，腊汁浸入面香，是关中街头最直接的满足。'
      },
      {
        id: 'biangbiang',
        name: '油泼面',
        city: '西安市',
        image:
          'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=900&q=80',
        description: '热油激出辣面香气，宽面筋道，气势和味道都很足。'
      }
    ]
  }
];

export function getDefaultProvince() {
  return provinces[0];
}

export function getProvinceByName(name: string) {
  return provinces.find((province) => province.name === name);
}

export function getVisibleCityLabels(province: Province) {
  if (province.cityLabels?.length) {
    return province.cityLabels.map((city) => city.label);
  }

  return province.cities;
}

const cityCoords: Record<string, [number, number]> = {
  成都市: [104.06, 30.67],
  乐山市: [103.76, 29.55],
  宜宾市: [104.64, 28.75],
  广州市: [113.26, 23.13],
  珠海市: [113.58, 22.27],
  昆明市: [102.83, 24.88],
  大理市: [100.24, 25.59],
  建水县: [102.83, 23.63],
  西安市: [108.94, 34.34],
  宝鸡市: [107.24, 34.36],
  汉中市: [107.02, 33.07]
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
