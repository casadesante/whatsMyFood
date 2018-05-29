const generateRestaurants = (params = {}) => {
  const list = [
    {
      key: 1,
      name: 'Mantra',
      img: 'https://www.hotpepper.jp/IMGH/68/49/P024076849/P024076849_480.jpg',
      distance: '1.6',
    },
    {
      key: 2,
      name: 'T.G.I.F',
      img: 'https://tblg.k-img.com/restaurant/images/Rvw/234/234973.jpg',
      distance: '7',
    },
  ];
  return list;
};

module.exports = {
  generateRestaurants,
};
