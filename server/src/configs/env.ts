import { InternalServerErrorException } from '@nestjs/common';

export default () => {
  const port = parseInt(process.env.PORT);

  if (isNaN(port)) {
    throw new InternalServerErrorException('Port를 설정해주세요.');
  }

  return {
    port,
  };
};
