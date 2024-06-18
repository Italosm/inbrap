import { CreateSegmentUseCase } from '@/segments/application/usecases/createsegment.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSegmentDto implements CreateSegmentUseCase.Input {
  @ApiProperty({ description: 'Nome do segmento' })
  @IsString()
  @IsNotEmpty()
  segment: string;

  @ApiProperty({
    description:
      'Indica se o segmento está publicado. Aceita "true", "false" ou pode ser omitido.',
    default: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : null,
  )
  is_published?: boolean;
}
