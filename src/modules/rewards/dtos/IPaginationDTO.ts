export default interface IPaginationDTO<T> {
  total: number;
  result: T[];
}
