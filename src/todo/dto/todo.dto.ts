import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TodoDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  is_complete: boolean;

  @IsBoolean()
  archive: boolean;
}
