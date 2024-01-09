import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SortOrder } from 'src/common/constants/enum.constant';

export class FilterOptions {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  perPage?: number;

  @IsString()
  @IsOptional()
  sortField?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder;
}
