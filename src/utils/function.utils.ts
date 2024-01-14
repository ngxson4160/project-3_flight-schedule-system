import { BadRequestException } from '@nestjs/common';
import { MessageResponse } from 'src/common/constants/message-response.constant';

export const checkValidTime = (startTime: string, endTime: string) => {
  const hourStart = startTime.slice(0, 2);
  const minusStart = startTime.slice(3, 5);

  const hourEnd = endTime.slice(0, 2);
  const minusEnd = endTime.slice(3, 5);

  if (hourStart > hourEnd || (hourStart == hourEnd && minusStart >= minusEnd)) {
    throw new BadRequestException(
      MessageResponse.COMMON.INVALID_TIME_START_AND_END,
    );
  }
};
