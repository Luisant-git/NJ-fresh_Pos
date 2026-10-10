export class CreateChequeEntryDto {
  chequeDate: string | Date;
  amount: number;
  chequeFrom: string;
  chequeTo: string;
}
