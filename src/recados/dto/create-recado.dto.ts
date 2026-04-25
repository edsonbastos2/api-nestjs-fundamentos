/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateRecadoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly texto: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @IsOptional()
  readonly de: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @IsOptional()
  readonly para: string;
}
