const generateRestaurants = (params = {}) => {
  const list = [
    {
      id: 1,
      name: 'Mantra',
      img: 'https://www.hotpepper.jp/IMGH/68/49/P024076849/P024076849_480.jpg',
      distance: '1.6',
      items: [
        {
          id: 1,
          type: 'fav',
          name: 'Biriyani',
          img:
            'https://dealocx.files.wordpress.com/2015/05/dealocx-blog-07.jpg',
        },
        {
          id: 2,
          type: 'good',
          name: 'Samosa',
          img:
            'https://media-cdn.tripadvisor.com/media/photo-s/0b/fe/b7/84/samossa.jpg',
        },
        {
          id: 3,
          type: 'fav',
          name: 'Naan',
          img: '',
        },
        {
          id: 4,
          type: 'fav',
          name: 'Manchurian',
          img:
            'https://2.bp.blogspot.com/-V0Fr_ufTp3c/WN6slehrp5I/AAAAAAAADIE/mv-x1LH3EXAKtz2DQ3DiX045cbnxR2M3wCLcB/s1600/egg%2Bmanchurian%2Brecipe.JPG',
        },
      ],
    },
    {
      id: 2,
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
