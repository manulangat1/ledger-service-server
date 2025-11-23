export class OkResponse {
  success: boolean;
  message: string;
}

export const okResponse = (
  message = 'Request executed successfully',
): OkResponse => ({
  success: true,
  message,
});
