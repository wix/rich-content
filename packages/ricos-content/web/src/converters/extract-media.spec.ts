import { extractMedia } from './extract-media';

/* eslint-disable max-len */
const draftContentWithImages = {
  blocks: [
    {
      key: '50k2j',
      text: 'image:',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {
        dynamicStyles: {
          'line-height': '1.38',
        },
      },
    },
    {
      key: '5idk1',
      text: ' ',
      type: 'atomic',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 1,
          key: 0,
        },
      ],
      data: {},
    },
    {
      key: '2amts',
      text: 'gallery:',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: 'fmfos',
      text: ' ',
      type: 'atomic',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 1,
          key: 1,
        },
      ],
      data: {},
    },
    {
      key: '6j4ge',
      text: '',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: 'p81l',
      text: '',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
  entityMap: {
    '0': {
      type: 'wix-draft-plugin-image',
      mutability: 'IMMUTABLE',
      data: {
        config: {
          alignment: 'center',
          size: 'content',
          showTitle: true,
          showDescription: true,
        },
        metadata: {
          caption: 'wedding',
        },
        disableExpand: false,
        src: {
          id: 'bcb5bc2f8a914694b8dc0c9ff2575f79',
          original_file_name: '8bb438_53cc82c7bc8a4b41baf4db640e8b5641.jpg',
          file_name: '8bb438_53cc82c7bc8a4b41baf4db640e8b5641.jpg',
          width: 5120,
          height: 3413,
        },
      },
    },
    '1': {
      type: 'wix-draft-plugin-gallery',
      mutability: 'IMMUTABLE',
      data: {
        config: {
          alignment: 'center',
          size: 'content',
          layout: 'small',
          spacing: 0,
        },
        items: [
          {
            metadata: {
              type: 'image',
              height: 3497,
              width: 5000,
              altText: 'Wedding2',
            },
            itemId: 'be4312f031f9850a825b2064b9c92d72',
            url: '8bb438_a3a11b05e3f54f77ba1c04dfba22c99c.jpg',
          },
          {
            metadata: {
              type: 'image',
              height: 4930,
              width: 3286,
            },
            itemId: 'ad45c7343a2ecf89982122c4097a054d',
            url: '8bb438_263b45a6faeb49e887b71d10a728516d.jpg',
          },
          {
            metadata: {
              type: 'image',
              height: 2247,
              width: 3370,
            },
            itemId: '0d2ad7a4819f0ed012d3953853070be8',
            url: '8bb438_0d6efcfc699344a2822fec577f398973.jpg',
          },
        ],
        styles: {
          galleryLayout: 2,
        },
        disableExpand: false,
      },
    },
  },
  VERSION: '8.36.3',
};

const draftContentWithVideos = {
  blocks: [
    {
      key: 'foo',
      text: '',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {
        interactions: [
          {
            type: 'READ_MORE',
            settings: {
              lines: 3,
              showToggle: false,
            },
          },
        ],
      },
    },
    {
      key: '97hse',
      text: ' ',
      type: 'atomic',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 1,
          key: 0,
        },
      ],
      data: {},
    },
    {
      key: '7s9rv',
      text: '',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: 'bnohc',
      text: ' ',
      type: 'atomic',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 1,
          key: 1,
        },
      ],
      data: {},
    },
    {
      key: '1uaau',
      text: '',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '3f38g',
      text: ' ',
      type: 'atomic',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 1,
          key: 2,
        },
      ],
      data: {},
    },
    {
      key: 'fkg6c',
      text: '',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '1ir3v',
      text: ' ',
      type: 'atomic',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 1,
          key: 3,
        },
      ],
      data: {},
    },
  ],
  entityMap: {
    '0': {
      type: 'wix-draft-plugin-video',
      mutability: 'IMMUTABLE',
      data: {
        config: {
          size: 'content',
          alignment: 'center',
        },
        tempData: false,
        src: 'https://www.youtube.com/watch?v=vzKryaN44ss',
        metadata: {
          author_name: 'Wix.com',
          width: 480,
          thumbnail_url: 'https://i.ytimg.com/vi/_zuIxexRrtk/hqdefault.jpg',
          thumbnail_width: 480,
          provider_url: 'https://www.youtube.com/',
          type: 'video',
          height: 270,
          author_url: 'https://www.youtube.com/user/Wix',
          version: '1.0',
          provider_name: 'YouTube',
          thumbnail_height: 360,
          title: 'How to Build a Wix Website for Your Business | James Veitch',
          html:
            '<iframe width="480" height="270" src="https://www.youtube.com/embed/_zuIxexRrtk?feature=oembed" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>',
          video_url: 'https://youtu.be/_zuIxexRrtk',
        },
      },
    },
    '1': {
      type: 'wix-draft-plugin-video',
      mutability: 'IMMUTABLE',
      data: {
        config: {
          size: 'content',
          alignment: 'center',
        },
        src: {
          pathname: 'video/11062b_a552731f40854d16a91627687fb8d1a6/1080p/mp4/file.mp4',
          thumbnail: {
            pathname: 'media/11062b_a552731f40854d16a91627687fb8d1a6f000.jpg',
            height: 1080,
            width: 1920,
          },
        },
        isCustomVideo: true,
      },
    },
    '2': {
      type: 'wix-draft-plugin-giphy',
      mutability: 'IMMUTABLE',
      data: {
        config: {
          size: 'content',
          alignment: 'center',
        },
        configViewer: {
          sizes: {
            desktop: 'original',
            mobile: 'original',
          },
        },
        gif: {
          originalUrl:
            'https://media2.giphy.com/media/jyDc9mR1kIlDW/giphy.gif?cid=558f2fbey3936wnjeper2c0a18tayu9xrqsc0aq8ftll2z5o&rid=giphy.gif&ct=g',
          originalMp4:
            'https://media2.giphy.com/media/jyDc9mR1kIlDW/giphy.mp4?cid=558f2fbey3936wnjeper2c0a18tayu9xrqsc0aq8ftll2z5o&rid=giphy.mp4&ct=g',
          stillUrl:
            'https://media2.giphy.com/media/jyDc9mR1kIlDW/giphy_s.gif?cid=558f2fbey3936wnjeper2c0a18tayu9xrqsc0aq8ftll2z5o&rid=giphy_s.gif&ct=g',
          downsizedUrl:
            'https://media2.giphy.com/media/jyDc9mR1kIlDW/giphy.gif?cid=558f2fbey3936wnjeper2c0a18tayu9xrqsc0aq8ftll2z5o&rid=giphy.gif&ct=g',
          downsizedStillUrl:
            'https://media2.giphy.com/media/jyDc9mR1kIlDW/giphy_s.gif?cid=558f2fbey3936wnjeper2c0a18tayu9xrqsc0aq8ftll2z5o&rid=giphy_s.gif&ct=g',
          downsizedSmallMp4:
            'https://media2.giphy.com/media/jyDc9mR1kIlDW/giphy-downsized-small.mp4?cid=558f2fbey3936wnjeper2c0a18tayu9xrqsc0aq8ftll2z5o&rid=giphy-downsized-small.mp4&ct=g',
          height: 284,
          width: 500,
        },
      },
    },
    '3': {
      type: 'wix-draft-plugin-gallery',
      mutability: 'IMMUTABLE',
      data: {
        config: {
          alignment: 'center',
          size: 'small',
          layout: 'small',
          spacing: 0,
        },
        styles: {
          galleryLayout: 2,
        },
        items: [
          {
            itemId: 'item-0',
            url: 'https://www.youtube.com/watch?v=ASe9-yoCk9k',
            mediaUrl: 'https://www.youtube.com/watch?v=ASe9-yoCk9k',
            metadata: {
              type: 'video',
              poster: {
                url: 'https://i.ytimg.com/vi/jhXlnvYZZQs/hqdefault.jpg',
              },
              videoId: 'https://www.youtube.com/watch?v=ASe9-yoCk9k',
              width: 600,
              height: 480,
              title: '',
              altText: 'ad',
            },
            selected: false,
          },
          {
            itemId: 'item-1',
            url:
              'https://media2.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif?cid=558f2fbeh2i5a2o44ta0ti98ldfxbefyfzd7xdac0bnh1hzn&rid=giphy.gif',
            mediaUrl:
              'https://media2.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy-downsized-small.mp4?cid=558f2fbeh2i5a2o44ta0ti98ldfxbefyfzd7xdac0bnh1hzn&rid=giphy-downsized-small.mp4',
            metadata: {
              type: 'video',
              videoUrl:
                'https://media2.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy-downsized-small.mp4?cid=558f2fbeh2i5a2o44ta0ti98ldfxbefyfzd7xdac0bnh1hzn&rid=giphy-downsized-small.mp4',
              videoId:
                'https://media2.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif?cid=558f2fbeh2i5a2o44ta0ti98ldfxbefyfzd7xdac0bnh1hzn&rid=giphy.gif',
              poster: {
                url:
                  'https://media2.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif?cid=558f2fbeh2i5a2o44ta0ti98ldfxbefyfzd7xdac0bnh1hzn&rid=giphy.gif',
                width: 268,
                height: 268,
              },
              source: 'giphy',
              width: 268,
              height: 268,
              title: 'dog',
            },
            selected: false,
          },
        ],
        disableExpand: false,
        disableDownload: false,
      },
    },
  },
  VERSION: '8.36.5',
};

describe('extractMedia (DraftContent)', () => {
  it('should extract images from image and gallery', () => {
    const expected = [
      {
        imageUrl: 'https://static.wixstatic.com/media/8bb438_53cc82c7bc8a4b41baf4db640e8b5641.jpg',
        imageWidth: 5120,
        imageHeight: 3413,
        imageCaption: 'wedding',
        imageAlt: '',
      },
      {
        imageUrl: 'https://static.wixstatic.com/media/8bb438_a3a11b05e3f54f77ba1c04dfba22c99c.jpg',
        imageWidth: 5000,
        imageHeight: 3497,
        imageAlt: 'Wedding2',
        imageCaption: '',
      },
      {
        imageUrl: 'https://static.wixstatic.com/media/8bb438_263b45a6faeb49e887b71d10a728516d.jpg',
        imageWidth: 3286,
        imageHeight: 4930,
        imageCaption: '',
        imageAlt: '',
      },
      {
        imageUrl: 'https://static.wixstatic.com/media/8bb438_0d6efcfc699344a2822fec577f398973.jpg',
        imageWidth: 3370,
        imageHeight: 2247,
        imageAlt: '',
        imageCaption: '',
      },
    ];
    const actual = extractMedia(draftContentWithImages);
    expect(actual).toStrictEqual(expected);
  });
  it('should extract videos from gallery, video and gif', () => {
    const expected = [
      {
        // video
        videoThumbnailUrl: 'https://i.ytimg.com/vi/_zuIxexRrtk/hqdefault.jpg',
        videoContentUrl: 'https://www.youtube.com/watch?v=vzKryaN44ss',
        videoName: 'How to Build a Wix Website for Your Business | James Veitch',
      },
      {
        // custom video
        videoContentUrl:
          'https://video.wixstatic.com/video/11062b_a552731f40854d16a91627687fb8d1a6/1080p/mp4/file.mp4',
        videoThumbnailUrl:
          'https://static.wixstatic.com/media/11062b_a552731f40854d16a91627687fb8d1a6f000.jpg',
        videoName: '',
      },
      {
        // giphy
        videoContentUrl:
          'https://media2.giphy.com/media/jyDc9mR1kIlDW/giphy-downsized-small.mp4?cid=558f2fbey3936wnjeper2c0a18tayu9xrqsc0aq8ftll2z5o&rid=giphy-downsized-small.mp4&ct=g',
        videoThumbnailUrl:
          'https://media2.giphy.com/media/jyDc9mR1kIlDW/giphy_s.gif?cid=558f2fbey3936wnjeper2c0a18tayu9xrqsc0aq8ftll2z5o&rid=giphy_s.gif&ct=g',
        videoName: '',
      },
      {
        // gallery
        videoContentUrl: 'https://www.youtube.com/watch?v=ASe9-yoCk9k',
        videoThumbnailUrl: 'https://i.ytimg.com/vi/jhXlnvYZZQs/hqdefault.jpg',
        videoName: '',
      },
      {
        videoContentUrl:
          'https://media2.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif?cid=558f2fbeh2i5a2o44ta0ti98ldfxbefyfzd7xdac0bnh1hzn&rid=giphy.gif',
        videoThumbnailUrl:
          'https://media2.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif?cid=558f2fbeh2i5a2o44ta0ti98ldfxbefyfzd7xdac0bnh1hzn&rid=giphy.gif',
        videoName: 'dog',
      },
    ];
    const actual = extractMedia(draftContentWithVideos);
    expect(actual).toStrictEqual(expected);
  });
});
