export enum MediaUploadErrorKey {
  GENERIC,
  SIZE_LIMIT,
  QUOTA_STORAGE_VISITOR,
  QUOTA_STORAGE_OWNER,
  QUOTA_VIDEO_VISITOR,
  QUOTA_VIDEO_OWNER,
  QUOTA_SINGLE_VIDEO_VISITOR,
  QUOTA_SINGLE_VIDEO_OWNER,
  MIME_TYPE_MISMATCH,
  WMP_ERROR_GENERAL,
  INVALID_SESSION,
  SESSION_EXPIRED,
  MISSING_WIX_SESSION,
  INCORRECT_FILE_INFO,
  CORRUPT_FILE,
  UNSUPPORTED_EXTENSION,
  MISSING_HEADER,
  FORMAT_CHUNK_MISSING,
  EXT_FILE_AUTHORIZATION,
  EXT_FILE_FORBBIDEN,
  IMAGE_FORMAT,
  CORRUPT_IMAGE,
  IMAGE_DIMENSIONS_EXCEEDED,
  MP4_STEREO_FORMAT,
  WAV_STEREO_FORMAT,
  WMA_BITRATE,
  WMA_BITRATE_LOSSY,
  MP4_BITRATE,
  MP3_UNSUPPORTED_STEREO,
  MP3_UNSUPPORTED_FORMAT,
  WAV_SAMPLE_RATE,
  AAC_UNSUPPORTED_FORMAT,
  WAV_UNSUPPORTED_FORMAT,
  WAV_SAMPLE_SIZE,
  WAV_CHUNK_SIZE,
  AUDIO_CODEC,
  EMPTY_FILE,
  MP4_UNSUPPORTED_FORMAT,
  MP4_SAMPLE_RATE,
  VIDEO_BITRATE,
  VIDEO_DURATION_MISMATCH,
  VIDEO_CODEC,
}

export interface MediaUploadError {
  msg?: string | JSX.Element;
  key?: MediaUploadErrorKey;
  args?: Record<string, string | number>;
}

export type UpdateEntityFunc<T> = ({
  data,
  error,
  index,
}: {
  data?: T;
  error?: MediaUploadError;
  index?: number;
}) => void;

export interface ImageComponentData {
  id: string;
  height: number;
  width: number;
  original_file_name: string;
  file_name: string;
}

export interface VideoComponentData {
  pathname: string;
  height?: number;
  width?: number;
  thumbnail: {
    pathname: string;
    height: number;
    width: number;
  };
}

export type MediaPrivacy = 'public' | 'private';

export interface FileComponentData {
  name: string;
  type: string;
  url?: string;
  id?: string;
  privacy?: MediaPrivacy;
}
