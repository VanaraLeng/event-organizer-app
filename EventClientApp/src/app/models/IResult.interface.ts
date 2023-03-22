export default interface IResult <Type> { 
    success: boolean,
    message: string,
    data: Type
}