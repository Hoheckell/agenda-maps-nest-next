import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResultDto<Result> {
  @ApiProperty()
  count: number;
  @ApiProperty()
  results: Result[];
}
