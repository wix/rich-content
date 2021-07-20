/* eslint-disable max-len */
import verticalEmbedDataNormalizer from './verticalEmbedDataNormalizer';

describe('Test vertical embed normalizer', () => {
  it('should normalize product', () => {
    const oldComponentData = {
      type: 'product',
      selectedProduct: {
        id: '265beaf5-3008-c5c2-fa5e-1447e0bebf71',
        name: 'flowers',
        imageSrc:
          'https://static.wixstatic.com/media/11062b_3a93dbce5ab64e7c90d9b2a83a598893~mv2.jpg/v1/fit/w_6720,h_4480,q_90/file.jpg',
        html:
          '<a class="vertical-embed-link" href="https://www.wix.app/stores/54e7b326-49ec-434f-a7cc-c2ad1eaec049/catalog/265beaf5-3008-c5c2-fa5e-1447e0bebf71?d=https://sapirs0.wixsite.com/mysite/product-page/flowers" target="_blank"><div class="vertical-embed-card vertical-embed-ltr vertical-embed-cardLayout"><div style="background-image:url(https://static.wixstatic.com/media/11062b_3a93dbce5ab64e7c90d9b2a83a598893~mv2.jpg/v1/fit/w_6720,h_4480,q_90/file.jpg)" class="vertical-embed-imageLayout vertical-embed-image"></div><div class="vertical-embed-content"><div><div class="vertical-embed-title">flowers</div></div><div class="vertical-embed-button"><div class="vertical-embed-buttonText">Comprar ahora</div></div></div></div></a>',
      },
    };
    const newComponentData = {
      type: 'product',
      selectedProduct: {
        ...oldComponentData.selectedProduct,
        pageUrl:
          'https://www.wix.app/stores/54e7b326-49ec-434f-a7cc-c2ad1eaec049/catalog/265beaf5-3008-c5c2-fa5e-1447e0bebf71?d=https://sapirs0.wixsite.com/mysite/product-page/flowers',
      },
    };
    expect(verticalEmbedDataNormalizer(oldComponentData)).toEqual(newComponentData);
  });

  it('should normalize event', () => {
    const oldComponentData = {
      type: 'event',
      selectedProduct: {
        id: '65129504-3bfc-44c8-90cc-f9eedfea9321',
        name:
          '2-week course of intensive physical research, with a sense of plenty of time for process and discovery. Rooted in Ohad N',
        imageSrc: 'https://static.wixstatic.com/media/2571849c6b0749a4bbd008a06fd65762.jpg',
        description: '13 de octubre de 2020 19:00–27 de octubre de 2020 23:00 | Suzanna Baby Shop',
        html:
          '<a class="vertical-embed-link" href="https://www.wix.app/events/54e7b326-49ec-434f-a7cc-c2ad1eaec049/65129504-3bfc-44c8-90cc-f9eedfea9321/details?d=https://sapirs0.wixsite.com/mysite/event-details/2-week-course-of-intensive-physical-research-with-a-sense-of-plenty-of-time-for-process-and-discovery-rooted-in-ohad-n" target="_blank"><div class="vertical-embed-card vertical-embed-ltr vertical-embed-cardLayout"><div style="background-image:url(https://static.wixstatic.com/media/2571849c6b0749a4bbd008a06fd65762.jpg)" class="vertical-embed-imageLayout vertical-embed-image"></div><div class="vertical-embed-content"><div><div class="vertical-embed-title">2-week course of intensive physical research, with a sense of plenty of time for...</div><div class="vertical-embed-subtitle">13 de octubre de 2020 19:00–27 de octubre de 2020 23:00<span><span class="vertical-embed-right">|</span>Suzanna Baby Shop</span></div></div><div class="vertical-embed-button"><div class="vertical-embed-buttonText">Regístrate</div></div></div></div></a>',
      },
    };
    const newComponentData = {
      type: 'event',
      selectedProduct: {
        ...oldComponentData.selectedProduct,
        scheduling: '13 de octubre de 2020 19:00–27 de octubre de 2020 23:00 ',
        location: ' Suzanna Baby Shop',
        pageUrl:
          'https://www.wix.app/events/54e7b326-49ec-434f-a7cc-c2ad1eaec049/65129504-3bfc-44c8-90cc-f9eedfea9321/details?d=https://sapirs0.wixsite.com/mysite/event-details/2-week-course-of-intensive-physical-research-with-a-sense-of-plenty-of-time-for-process-and-discovery-rooted-in-ohad-n',
      },
    };
    expect(verticalEmbedDataNormalizer(oldComponentData)).toEqual(newComponentData);
  });

  it('should normalize booking', () => {
    const oldComponentData = {
      type: 'booking',
      selectedProduct: {
        id: '03ef6546-985d-4739-951e-ca897375b967',
        name: 'CUPCAKE MASTER',
        imageSrc: 'https://static.wixstatic.com/media/78ccafc88f7fce3e55bd7a33f166704b.jpg',
        description: 90,
        html:
          '<a class="vertical-embed-link" href="https://www.wix.app/bookings/54e7b326-49ec-434f-a7cc-c2ad1eaec049/service/03ef6546-985d-4739-951e-ca897375b967/details?d=https://sapirs0.wixsite.com/mysite/bookings-checkout/cupcake-master" target="_blank"><div class="vertical-embed-card vertical-embed-ltr vertical-embed-cardLayout"><div style="background-image:url(https://static.wixstatic.com/media/78ccafc88f7fce3e55bd7a33f166704b.jpg)" class="vertical-embed-imageLayout vertical-embed-image"></div><div class="vertical-embed-content"><div><div class="vertical-embed-title">CUPCAKE MASTER</div><div class="vertical-embed-subtitle">1h 30min</div></div><div class="vertical-embed-button"><div class="vertical-embed-buttonText">Reservar ahora</div></div></div></div></a>',
      },
    };
    const newComponentData = {
      type: 'booking',
      selectedProduct: {
        ...oldComponentData.selectedProduct,
        durations: 90,
        pageUrl:
          'https://www.wix.app/bookings/54e7b326-49ec-434f-a7cc-c2ad1eaec049/service/03ef6546-985d-4739-951e-ca897375b967/details?d=https://sapirs0.wixsite.com/mysite/bookings-checkout/cupcake-master',
      },
    };
    expect(verticalEmbedDataNormalizer(oldComponentData)).toEqual(newComponentData);
  });
});
