/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateRecadoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly texto: string;

  @IsPositive()
  deId: number;

  @IsPositive()
  paraId: number;
}
