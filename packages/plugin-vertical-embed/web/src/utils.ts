import { verticalEmbedProviders } from './constants';

export const convertDuration = (durationInMinutes, t) => {
  if (durationInMinutes < 60) {
    return t('VerticalEmbed_Units_Minute', { minutes: durationInMinutes });
  }
  const hours = durationInMinutes / 60;
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  const durationInHours =
    rminutes === 0
      ? t('VerticalEmbed_Units_Hour', { hours: rhours })
      : t('VerticalEmbed_Units_Hour', { hours: rhours }) +
        ' ' +
        t('VerticalEmbed_Units_Minute', { minutes: rminutes });
  return durationInHours;
};

const getBookingData = (data, t) => {
  const { name, imageSrc, pageUrl, durations } = data;
  const content = {
    title: name,
    info: { leftSubtitle: durations && convertDuration(durations, t) },
    buttonText: t('VerticalEmbed_Bookings_Button'),
  };
  return { url: pageUrl, imageSrc, content };
};

const getEventData = (data, t) => {
  const { name, imageSrc, scheduling, pageUrl, location } = data;
  const content = {
    title: name,
    info: { leftSubtitle: scheduling, rightSubtitle: location },
    buttonText: t('VerticalEmbed_Events_Button'),
  };
  return { url: pageUrl, imageSrc, content };
};

const getProductData = (data, t) => {
  const { name, imageSrc, pageUrl } = data;
  const content = {
    title: name,
    buttonText: t('VerticalEmbed_Products_Button'),
  };
  return { url: pageUrl, imageSrc, content };
};

export const dataTypeMapper = {
  [verticalEmbedProviders.booking]: getBookingData,
  [verticalEmbedProviders.event]: getEventData,
  [verticalEmbedProviders.product]: getProductData,
};
