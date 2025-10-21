export class PushPayloadDto {
  title: string;
  body: string;
  icon?: string;
  data?: {
    url: string;
  };
}
