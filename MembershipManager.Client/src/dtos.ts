/* Options:
Date: 2025-07-12 17:44:41
Version: 8.80
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

//GlobalNamespace: 
//MakePropertiesOptional: False
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion: 
//AddDescriptionAsComments: True
//IncludeTypes: 
//ExcludeTypes: 
//DefaultImports: 
*/

// @ts-nocheck

export interface IReturn<T>
{
    createResponse(): T;
}

export interface IReturnVoid
{
    createResponse(): void;
}

export interface IGet
{
}

export interface IHasSessionId
{
    sessionId?: string;
}

export interface IHasBearerToken
{
    bearerToken?: string;
}

export interface IPost
{
}

export interface IPut
{
}

export interface IDelete
{
}

export interface ICreateDb<Table>
{
}

export interface IPatchDb<Table>
{
}

export interface IDeleteDb<Table>
{
}

// @DataContract
export class QueryBase
{
    // @DataMember(Order=1)
    public skip?: number;

    // @DataMember(Order=2)
    public take?: number;

    // @DataMember(Order=3)
    public orderBy: string;

    // @DataMember(Order=4)
    public orderByDesc: string;

    // @DataMember(Order=5)
    public include: string;

    // @DataMember(Order=6)
    public fields: string;

    // @DataMember(Order=7)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<QueryBase>) { (Object as any).assign(this, init); }
}

export class QueryData<T> extends QueryBase
{

    public constructor(init?: Partial<QueryData<T>>) { super(init); (Object as any).assign(this, init); }
}

export class QueryDb<T> extends QueryBase
{

    public constructor(init?: Partial<QueryDb<T>>) { super(init); (Object as any).assign(this, init); }
}

// @DataContract
export class AuditBase
{
    // @DataMember(Order=1)
    public createdDate: string;

    // @DataMember(Order=2)
    // @Required()
    public createdBy: string;

    // @DataMember(Order=3)
    public modifiedDate: string;

    // @DataMember(Order=4)
    // @Required()
    public modifiedBy: string;

    // @DataMember(Order=5)
    public deletedDate?: string;

    // @DataMember(Order=6)
    public deletedBy: string;

    public constructor(init?: Partial<AuditBase>) { (Object as any).assign(this, init); }
}

export enum RoomType
{
    Single = 'Single',
    Double = 'Double',
    Queen = 'Queen',
    Twin = 'Twin',
    Suite = 'Suite',
}

/** @description Discount Coupons */
export class Coupon
{
    public id: string;
    public description: string;
    public discount: number;
    public expiryDate: string;

    public constructor(init?: Partial<Coupon>) { (Object as any).assign(this, init); }
}

/** @description Booking Details */
export class Booking extends AuditBase
{
    public id: number;
    public name: string;
    public roomType: RoomType;
    public roomNumber: number;
    public bookingStartDate: string;
    public bookingEndDate?: string;
    public cost: number;
    // @References("typeof(MembershipManager.ServiceModel.Coupon)")
    public couponId?: string;

    public discount: Coupon;
    public notes?: string;
    public cancelled?: boolean;

    public constructor(init?: Partial<Booking>) { super(init); (Object as any).assign(this, init); }
}

export enum UnitType
{
    Pack = 'Pack',
    Troop = 'Troop',
    Crew = 'Crew',
    Ship = 'Ship',
}

export enum Sex
{
    Family = 'Family',
    Male = 'Male',
    Female = 'Female',
}

export class EventUnit extends AuditBase
{
    public id: number;
    // @References("typeof(MembershipManager.ServiceModel.Event)")
    public eventId: number;

    // @References("typeof(MembershipManager.ServiceModel.Unit)")
    public unitId: number;

    public constructor(init?: Partial<EventUnit>) { super(init); (Object as any).assign(this, init); }
}

export enum SchoolType
{
    Public = 'Public',
    Private = 'Private',
}

export enum GradeLevels
{
    gKG_5 = 'gKG_5',
    gKG_8 = 'gKG_8',
    gKG_12 = 'gKG_12',
    gPK_5 = 'gPK_5',
    gPK_8 = 'gPK_8',
    gPK_12 = 'gPK_12',
    g6_8 = 'g6_8',
    g6_12 = 'g6_12',
    g9_12 = 'g9_12',
}

export enum State
{
    FL = 'FL',
}

export class EventSchool extends AuditBase
{
    public id: number;
    public eventId: number;
    public schoolId: number;

    public constructor(init?: Partial<EventSchool>) { super(init); (Object as any).assign(this, init); }
}

export class SchoolNote extends AuditBase
{
    public id: number;
    public noteId: number;
    public schoolId: number;

    public constructor(init?: Partial<SchoolNote>) { super(init); (Object as any).assign(this, init); }
}

export class School extends AuditBase
{
    public id: number;
    public description: string;
    public schoolType: SchoolType;
    public gradeLevels: GradeLevels;
    public address: string;
    public city: string;
    public state: State;
    public zipCode: string;
    public eventsLink: EventSchool[] = [];
    public unitsLink: UnitSchool[] = [];
    public notesLink: SchoolNote[] = [];

    public constructor(init?: Partial<School>) { super(init); (Object as any).assign(this, init); }
}

export class UnitSchool extends AuditBase
{
    public id: number;
    // @References("typeof(MembershipManager.ServiceModel.Unit)")
    public unitId: number;

    public unit: Unit;
    // @References("typeof(MembershipManager.ServiceModel.School)")
    public schoolId: number;

    public school: School;

    public constructor(init?: Partial<UnitSchool>) { super(init); (Object as any).assign(this, init); }
}

export class UnitNote extends AuditBase
{
    public id: number;
    public noteId: number;
    public unitId: number;

    public constructor(init?: Partial<UnitNote>) { super(init); (Object as any).assign(this, init); }
}

export class Unit extends AuditBase
{
    public id: number;
    // @References("typeof(MembershipManager.ServiceModel.District)")
    public districtId: number;

    public district: District;
    public type: UnitType;
    public sex: Sex;
    public number: number;
    public eventsLink: EventUnit[] = [];
    public schoolsLink: UnitSchool[] = [];
    public notesLink: UnitNote[] = [];

    public constructor(init?: Partial<Unit>) { super(init); (Object as any).assign(this, init); }
}

export class District extends AuditBase
{
    public id: number;
    public description: string;
    // @References("typeof(MembershipManager.ServiceModel.Council)")
    public councilId: number;

    public units: Unit[] = [];

    public constructor(init?: Partial<District>) { super(init); (Object as any).assign(this, init); }
}

export class Council extends AuditBase
{
    public id: number;
    public description: string;
    public districts: District[] = [];

    public constructor(init?: Partial<Council>) { super(init); (Object as any).assign(this, init); }
}

export enum EventType
{
    SchoolTalk = 'SchoolTalk',
    OpenHouse = 'OpenHouse',
    JoinScoutingNight = 'JoinScoutingNight',
    Community = 'Community',
}

export class EventNote extends AuditBase
{
    public id: number;
    public noteId: number;
    public eventId: number;

    public constructor(init?: Partial<EventNote>) { super(init); (Object as any).assign(this, init); }
}

export class Event extends AuditBase
{
    public id: number;
    public eventType: EventType;
    public description: string;
    public dateTime: string;
    public address: string;
    public city: string;
    public state: State;
    public zipCode: string;
    public isConfirmed: boolean;
    public areFlyersOrdered: boolean;
    public requiresFacilitron: boolean;
    public isFacilitronConfirmed: boolean;
    public schoolsLink: EventSchool[] = [];
    public unitsLink: EventUnit[] = [];
    public notesLink: EventNote[] = [];

    public constructor(init?: Partial<Event>) { super(init); (Object as any).assign(this, init); }
}

export class Note extends AuditBase
{
    public id: number;
    public description: string;
    public schoolsLink: SchoolNote[] = [];
    public unitsLink: UnitNote[] = [];
    public eventsLinks: EventNote[] = [];

    public constructor(init?: Partial<Note>) { super(init); (Object as any).assign(this, init); }
}

export class Forecast implements IGet
{
    public date: string;
    public temperatureC: number;
    public summary?: string;
    public temperatureF: number;

    public constructor(init?: Partial<Forecast>) { (Object as any).assign(this, init); }
}

export class PageStats
{
    public label: string;
    public total: number;

    public constructor(init?: Partial<PageStats>) { (Object as any).assign(this, init); }
}

// @DataContract
export class ResponseError
{
    // @DataMember(Order=1)
    public errorCode: string;

    // @DataMember(Order=2)
    public fieldName: string;

    // @DataMember(Order=3)
    public message: string;

    // @DataMember(Order=4)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<ResponseError>) { (Object as any).assign(this, init); }
}

// @DataContract
export class ResponseStatus
{
    // @DataMember(Order=1)
    public errorCode: string;

    // @DataMember(Order=2)
    public message: string;

    // @DataMember(Order=3)
    public stackTrace: string;

    // @DataMember(Order=4)
    public errors: ResponseError[];

    // @DataMember(Order=5)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<ResponseStatus>) { (Object as any).assign(this, init); }
}

// @DataContract
export class QueryResponse<T>
{
    // @DataMember(Order=1)
    public offset: number;

    // @DataMember(Order=2)
    public total: number;

    // @DataMember(Order=3)
    public results: T[];

    // @DataMember(Order=4)
    public meta: { [index:string]: string; };

    // @DataMember(Order=5)
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<QueryResponse<T>>) { (Object as any).assign(this, init); }
}

export class HelloResponse
{
    public result: string;

    public constructor(init?: Partial<HelloResponse>) { (Object as any).assign(this, init); }
}

export class AdminDataResponse
{
    public pageStats: PageStats[] = [];

    public constructor(init?: Partial<AdminDataResponse>) { (Object as any).assign(this, init); }
}

// @DataContract
export class RegisterResponse implements IHasSessionId, IHasBearerToken
{
    // @DataMember(Order=1)
    public userId: string;

    // @DataMember(Order=2)
    public sessionId: string;

    // @DataMember(Order=3)
    public userName: string;

    // @DataMember(Order=4)
    public referrerUrl: string;

    // @DataMember(Order=5)
    public bearerToken: string;

    // @DataMember(Order=6)
    public refreshToken: string;

    // @DataMember(Order=7)
    public refreshTokenExpiry?: string;

    // @DataMember(Order=8)
    public roles: string[];

    // @DataMember(Order=9)
    public permissions: string[];

    // @DataMember(Order=10)
    public redirectUrl: string;

    // @DataMember(Order=11)
    public responseStatus: ResponseStatus;

    // @DataMember(Order=12)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<RegisterResponse>) { (Object as any).assign(this, init); }
}

export class Todo
{
    public id: number;
    public text: string;
    public isFinished: boolean;

    public constructor(init?: Partial<Todo>) { (Object as any).assign(this, init); }
}

// @DataContract
export class AuthenticateResponse implements IHasSessionId, IHasBearerToken
{
    // @DataMember(Order=1)
    public userId: string;

    // @DataMember(Order=2)
    public sessionId: string;

    // @DataMember(Order=3)
    public userName: string;

    // @DataMember(Order=4)
    public displayName: string;

    // @DataMember(Order=5)
    public referrerUrl: string;

    // @DataMember(Order=6)
    public bearerToken: string;

    // @DataMember(Order=7)
    public refreshToken: string;

    // @DataMember(Order=8)
    public refreshTokenExpiry?: string;

    // @DataMember(Order=9)
    public profileUrl: string;

    // @DataMember(Order=10)
    public roles: string[];

    // @DataMember(Order=11)
    public permissions: string[];

    // @DataMember(Order=12)
    public authProvider: string;

    // @DataMember(Order=13)
    public responseStatus: ResponseStatus;

    // @DataMember(Order=14)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<AuthenticateResponse>) { (Object as any).assign(this, init); }
}

// @DataContract
export class IdResponse
{
    // @DataMember(Order=1)
    public id: string;

    // @DataMember(Order=2)
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<IdResponse>) { (Object as any).assign(this, init); }
}

// @Route("/hello/{Name}")
export class Hello implements IReturn<HelloResponse>, IGet
{
    public name: string;

    public constructor(init?: Partial<Hello>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'Hello'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new HelloResponse(); }
}

export class GetWeatherForecast implements IReturn<Forecast[]>, IGet
{
    public date?: string;

    public constructor(init?: Partial<GetWeatherForecast>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetWeatherForecast'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new Array<Forecast>(); }
}

export class AdminData implements IReturn<AdminDataResponse>, IGet
{

    public constructor(init?: Partial<AdminData>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'AdminData'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new AdminDataResponse(); }
}

/** @description Sign Up */
// @Api(Description="Sign Up")
// @DataContract
export class Register implements IReturn<RegisterResponse>, IPost
{
    // @DataMember(Order=1)
    public userName: string;

    // @DataMember(Order=2)
    public firstName: string;

    // @DataMember(Order=3)
    public lastName: string;

    // @DataMember(Order=4)
    public displayName: string;

    // @DataMember(Order=5)
    public email: string;

    // @DataMember(Order=6)
    public password: string;

    // @DataMember(Order=7)
    public confirmPassword: string;

    // @DataMember(Order=8)
    public autoLogin?: boolean;

    // @DataMember(Order=10)
    public errorView: string;

    // @DataMember(Order=11)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<Register>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'Register'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new RegisterResponse(); }
}

// @Route("/confirm-email")
export class ConfirmEmail implements IReturnVoid, IGet
{
    public userId: string;
    public code: string;
    public returnUrl?: string;

    public constructor(init?: Partial<ConfirmEmail>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'ConfirmEmail'; }
    public getMethod() { return 'GET'; }
    public createResponse() {}
}

// @Route("/todos", "GET")
export class QueryTodos extends QueryData<Todo> implements IReturn<QueryResponse<Todo>>
{
    public id?: number;
    public ids?: number[];
    public textContains?: string;

    public constructor(init?: Partial<QueryTodos>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryTodos'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<Todo>(); }
}

// @Route("/todos", "POST")
export class CreateTodo implements IReturn<Todo>, IPost
{
    // @Validate(Validator="NotEmpty")
    public text: string;

    public constructor(init?: Partial<CreateTodo>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateTodo'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new Todo(); }
}

// @Route("/todos/{Id}", "PUT")
export class UpdateTodo implements IReturn<Todo>, IPut
{
    public id: number;
    // @Validate(Validator="NotEmpty")
    public text: string;

    public isFinished: boolean;

    public constructor(init?: Partial<UpdateTodo>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateTodo'; }
    public getMethod() { return 'PUT'; }
    public createResponse() { return new Todo(); }
}

// @Route("/todos/{Id}", "DELETE")
export class DeleteTodo implements IReturnVoid, IDelete
{
    public id: number;

    public constructor(init?: Partial<DeleteTodo>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteTodo'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/todos", "DELETE")
export class DeleteTodos implements IReturnVoid, IDelete
{
    public ids: number[] = [];

    public constructor(init?: Partial<DeleteTodos>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteTodos'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

/** @description Sign In */
// @Route("/auth", "GET,POST")
// @Route("/auth/{provider}", "POST")
// @Api(Description="Sign In")
// @DataContract
export class Authenticate implements IReturn<AuthenticateResponse>, IPost
{
    /** @description AuthProvider, e.g. credentials */
    // @DataMember(Order=1)
    public provider: string;

    // @DataMember(Order=2)
    public userName: string;

    // @DataMember(Order=3)
    public password: string;

    // @DataMember(Order=4)
    public rememberMe?: boolean;

    // @DataMember(Order=5)
    public accessToken: string;

    // @DataMember(Order=6)
    public accessTokenSecret: string;

    // @DataMember(Order=7)
    public returnUrl: string;

    // @DataMember(Order=8)
    public errorView: string;

    // @DataMember(Order=9)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<Authenticate>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'Authenticate'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new AuthenticateResponse(); }
}

/** @description Find Bookings */
// @Route("/bookings", "GET")
// @Route("/bookings/{Id}", "GET")
export class QueryBookings extends QueryDb<Booking> implements IReturn<QueryResponse<Booking>>
{
    public id?: number;

    public constructor(init?: Partial<QueryBookings>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryBookings'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<Booking>(); }
}

/** @description Find Coupons */
// @Route("/coupons", "GET")
export class QueryCoupons extends QueryDb<Coupon> implements IReturn<QueryResponse<Coupon>>
{
    public id?: string;

    public constructor(init?: Partial<QueryCoupons>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryCoupons'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<Coupon>(); }
}

/** @description Find Councils */
// @ValidateRequest(Validator="HasRole(`NewMemberCoordinator`)")
export class QueryCouncil extends QueryDb<Council> implements IReturn<QueryResponse<Council>>
{

    public constructor(init?: Partial<QueryCouncil>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryCouncil'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<Council>(); }
}

/** @description Find Districts */
// @ValidateRequest(Validator="HasRole(`NewMemberCoordinator`)")
export class QueryDistrict extends QueryDb<District> implements IReturn<QueryResponse<District>>
{

    public constructor(init?: Partial<QueryDistrict>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryDistrict'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<District>(); }
}

/** @description Find Events */
// @Route("/events", "GET")
// @Route("/events/{Id}", "GET")
// @ValidateRequest(Validator="HasRole(`NewMemberCoordinator`)")
export class QueryEvent extends QueryDb<Event> implements IReturn<QueryResponse<Event>>
{
    public id?: number;

    public constructor(init?: Partial<QueryEvent>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryEvent'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<Event>(); }
}

/** @description Find Event Notes */
// @ValidateRequest(Validator="HasRole(`NewMemberCoordinator`)")
export class QueryEventNote extends QueryDb<EventNote> implements IReturn<QueryResponse<EventNote>>
{

    public constructor(init?: Partial<QueryEventNote>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryEventNote'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<EventNote>(); }
}

/** @description Find Event & School Links */
// @ValidateRequest(Validator="HasRole(`NewMemberCoordinator`)")
export class QueryEventSchool extends QueryDb<EventSchool> implements IReturn<QueryResponse<EventSchool>>
{

    public constructor(init?: Partial<QueryEventSchool>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryEventSchool'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<EventSchool>(); }
}

/** @description Find Event & Unit links */
// @ValidateRequest(Validator="HasRole(`NewMemberCoordinator`)")
export class QueryEventUnit extends QueryDb<EventUnit> implements IReturn<QueryResponse<EventUnit>>
{

    public constructor(init?: Partial<QueryEventUnit>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryEventUnit'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<EventUnit>(); }
}

/** @description Find Notes */
// @ValidateRequest(Validator="HasRole(`NewMemberCoordinator`)")
export class QueryNotes extends QueryDb<Note> implements IReturn<QueryResponse<Note>>
{
    public ids: number[];

    public constructor(init?: Partial<QueryNotes>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryNotes'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<Note>(); }
}

/** @description Find Schools */
// @ValidateRequest(Validator="HasRole(`NewMemberCoordinator`)")
export class QuerySchool extends QueryDb<School> implements IReturn<QueryResponse<School>>
{

    public constructor(init?: Partial<QuerySchool>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QuerySchool'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<School>(); }
}

/** @description Find Note & School Links */
// @ValidateRequest(Validator="HasRole(`NewMemberCoordinator`)")
export class QuerySchoolNote extends QueryDb<SchoolNote> implements IReturn<QueryResponse<SchoolNote>>
{

    public constructor(init?: Partial<QuerySchoolNote>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QuerySchoolNote'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<SchoolNote>(); }
}

/** @description Find Units */
// @Route("/units", "GET")
// @Route("/units/{Id}", "GET")
// @ValidateRequest(Validator="HasRole(`NewMemberCoordinator`)")
export class QueryUnits extends QueryDb<Unit> implements IReturn<QueryResponse<Unit>>
{
    public id?: number;
    public number?: number;

    public constructor(init?: Partial<QueryUnits>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryUnits'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<Unit>(); }
}

/** @description Find Note & Unit Links */
// @ValidateRequest(Validator="HasRole(`NewMemberCoordinator`)")
export class QueryUnitNote extends QueryDb<UnitNote> implements IReturn<QueryResponse<UnitNote>>
{

    public constructor(init?: Partial<QueryUnitNote>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryUnitNote'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<UnitNote>(); }
}

/** @description Find School & Unit links */
// @ValidateRequest(Validator="HasRole(`NewMemberCoordinator`)")
export class QueryUnitSchool extends QueryDb<UnitSchool> implements IReturn<QueryResponse<UnitSchool>>
{

    public constructor(init?: Partial<QueryUnitSchool>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryUnitSchool'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<UnitSchool>(); }
}

/** @description Create a new Booking */
// @Route("/bookings", "POST")
// @ValidateRequest(Validator="HasRole(`Employee`)")
export class CreateBooking implements IReturn<IdResponse>, ICreateDb<Booking>
{
    /** @description Name this Booking is for */
    // @Validate(Validator="NotEmpty")
    public name: string;

    public roomType: RoomType;
    // @Validate(Validator="GreaterThan(0)")
    public roomNumber: number;

    // @Validate(Validator="GreaterThan(0)")
    public cost: number;

    // @Required()
    public bookingStartDate: string;

    public bookingEndDate?: string;
    public notes?: string;
    public couponId?: string;

    public constructor(init?: Partial<CreateBooking>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateBooking'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Update an existing Booking */
// @Route("/booking/{Id}", "PATCH")
// @ValidateRequest(Validator="HasRole(`Employee`)")
export class UpdateBooking implements IReturn<IdResponse>, IPatchDb<Booking>
{
    public id: number;
    public name?: string;
    public roomType?: RoomType;
    // @Validate(Validator="GreaterThan(0)")
    public roomNumber?: number;

    // @Validate(Validator="GreaterThan(0)")
    public cost?: number;

    public bookingStartDate?: string;
    public bookingEndDate?: string;
    public notes?: string;
    public couponId?: string;
    public cancelled?: boolean;

    public constructor(init?: Partial<UpdateBooking>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateBooking'; }
    public getMethod() { return 'PATCH'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Delete a Booking */
// @Route("/booking/{Id}", "DELETE")
// @ValidateRequest(Validator="HasRole(`Manager`)")
export class DeleteBooking implements IReturnVoid, IDeleteDb<Booking>
{
    public id: number;

    public constructor(init?: Partial<DeleteBooking>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteBooking'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/coupons", "POST")
// @ValidateRequest(Validator="HasRole(`Employee`)")
export class CreateCoupon implements IReturn<IdResponse>, ICreateDb<Coupon>
{
    // @Validate(Validator="NotEmpty")
    public description: string;

    // @Validate(Validator="GreaterThan(0)")
    public discount: number;

    // @Validate(Validator="NotNull")
    public expiryDate: string;

    public constructor(init?: Partial<CreateCoupon>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateCoupon'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new IdResponse(); }
}

// @Route("/coupons/{Id}", "PATCH")
// @ValidateRequest(Validator="HasRole(`Employee`)")
export class UpdateCoupon implements IReturn<IdResponse>, IPatchDb<Coupon>
{
    public id: string;
    // @Validate(Validator="NotEmpty")
    public description: string;

    // @Validate(Validator="NotNull")
    // @Validate(Validator="GreaterThan(0)")
    public discount: number;

    // @Validate(Validator="NotNull")
    public expiryDate: string;

    public constructor(init?: Partial<UpdateCoupon>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateCoupon'; }
    public getMethod() { return 'PATCH'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Delete a Coupon */
// @Route("/coupons/{Id}", "DELETE")
// @ValidateRequest(Validator="HasRole(`Manager`)")
export class DeleteCoupon implements IReturnVoid, IDeleteDb<Coupon>
{
    public id: string;

    public constructor(init?: Partial<DeleteCoupon>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteCoupon'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

/** @description Create a new Council */
// @ValidateRequest(Validator="HasRole(`Admin`)")
export class CreateCouncil implements IReturn<IdResponse>, ICreateDb<Council>
{
    // @Validate(Validator="MaximumLength(25)")
    public description: string;

    public constructor(init?: Partial<CreateCouncil>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateCouncil'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Update a Council */
// @ValidateRequest(Validator="HasRole(`Admin`)")
export class UpdateCouncil implements IReturn<IdResponse>, IPatchDb<Council>
{
    public id: number;
    // @Validate(Validator="MaximumLength(25)")
    public description: string;

    public constructor(init?: Partial<UpdateCouncil>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateCouncil'; }
    public getMethod() { return 'PATCH'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Delete a Council */
// @ValidateRequest(Validator="HasRole(`Admin`)")
export class DeleteCouncil implements IReturnVoid, IDeleteDb<Council>
{
    public id: number;

    public constructor(init?: Partial<DeleteCouncil>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteCouncil'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

/** @description Create a new District */
// @ValidateRequest(Validator="HasRole(`Admin`)")
export class CreateDistrict implements IReturn<IdResponse>, ICreateDb<District>
{
    // @Validate(Validator="MaximumLength(25)")
    public description: string;

    public councilId: number;

    public constructor(init?: Partial<CreateDistrict>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateDistrict'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Update a District */
// @ValidateRequest(Validator="HasRole(`Admin`)")
export class UpdateDistrict implements IReturn<IdResponse>, IPatchDb<District>
{
    public id: number;
    // @Validate(Validator="MaximumLength(25)")
    public description: string;

    public councilId: number;

    public constructor(init?: Partial<UpdateDistrict>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateDistrict'; }
    public getMethod() { return 'PATCH'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Delete a District */
// @ValidateRequest(Validator="HasRole(`Admin`)")
export class DeleteDistrict implements IReturnVoid, IDeleteDb<District>
{
    public id: number;

    public constructor(init?: Partial<DeleteDistrict>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteDistrict'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

/** @description Create a new Event */
// @ValidateRequest(Validator="HasRole(`Committee`)")
export class CreateEvent implements IReturn<IdResponse>, ICreateDb<Event>
{
    public eventType: EventType;
    public description: string;
    public dateTime: string;
    public address: string;
    public city: string;
    public state: State;
    public zipCode: string;
    public isConfirmed: boolean;
    public areFlyersOrdered: boolean;
    public requiresFacilitron: boolean;
    public isFacilitronConfirmed: boolean;

    public constructor(init?: Partial<CreateEvent>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateEvent'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Update an Event */
// @ValidateRequest(Validator="HasRole(`Committee`)")
export class UpdateEvent implements IReturn<IdResponse>, IPatchDb<Event>
{
    public eventType: EventType;
    public description: string;
    public dateTime: string;
    public address: string;
    public city: string;
    public zipCode: string;
    public isConfirmed: boolean;
    public areFlyersOrdered: boolean;
    public requiresFacilitron: boolean;
    public isFacilitronConfirmed: boolean;

    public constructor(init?: Partial<UpdateEvent>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateEvent'; }
    public getMethod() { return 'PATCH'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Delete an Event */
// @ValidateRequest(Validator="HasRole(`MembershipChair`)")
export class DeleteEvent implements IReturnVoid, IDeleteDb<Event>
{
    public id: number;

    public constructor(init?: Partial<DeleteEvent>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteEvent'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

/** @description Create a new Event Note */
// @ValidateRequest(Validator="HasRole(`Committee`)")
export class CreateEventNote implements IReturn<IdResponse>, ICreateDb<EventNote>
{
    public noteId: number;
    public eventId: number;

    public constructor(init?: Partial<CreateEventNote>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateEventNote'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Update an Event Note */
// @ValidateRequest(Validator="HasRole(`Committee`)")
export class UpdateEventNote implements IReturn<IdResponse>, IPatchDb<EventNote>
{
    public noteId: number;
    public eventId: number;

    public constructor(init?: Partial<UpdateEventNote>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateEventNote'; }
    public getMethod() { return 'PATCH'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Delete an Event Note */
// @ValidateRequest(Validator="HasRole(`MembershipChair`)")
export class DeleteEventNote implements IReturnVoid, IDeleteDb<EventNote>
{
    public id: number;

    public constructor(init?: Partial<DeleteEventNote>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteEventNote'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

/** @description Link a School to an Event */
// @ValidateRequest(Validator="HasRole(`Committee`)")
export class CreateEventSchool implements IReturn<IdResponse>, ICreateDb<EventSchool>
{
    public eventId: number;
    public schoolId: number;

    public constructor(init?: Partial<CreateEventSchool>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateEventSchool'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Delete a link of a School to an Event */
// @ValidateRequest(Validator="HasRole(`MembershipChair`)")
export class DeleteEventSchool implements IReturnVoid, IDeleteDb<EventSchool>
{
    public id: number;

    public constructor(init?: Partial<DeleteEventSchool>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteEventSchool'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

/** @description Link an Event to a Unit */
// @ValidateRequest(Validator="HasRole(`Committee`)")
export class CreateEventUnit implements IReturn<IdResponse>, ICreateDb<EventUnit>
{
    public eventId: number;
    public unitId: number;

    public constructor(init?: Partial<CreateEventUnit>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateEventUnit'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Delete a link of an Event to a Unit */
// @ValidateRequest(Validator="HasRole(`MembershipChair`)")
export class DeleteEventUnit implements IReturnVoid, IDeleteDb<EventUnit>
{
    public id: number;

    public constructor(init?: Partial<DeleteEventUnit>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteEventUnit'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

/** @description Create a new Note */
// @ValidateRequest(Validator="HasRole(`Committee`)")
export class CreateNote implements IReturn<IdResponse>, ICreateDb<Note>
{
    public description: string;

    public constructor(init?: Partial<CreateNote>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateNote'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Update a Note */
// @ValidateRequest(Validator="HasRole(`Committee`)")
export class UpdateNote implements IReturn<IdResponse>, IPatchDb<Note>
{
    public id: number;
    // @Validate(Validator="MaximumLength(25)")
    public description: string;

    public constructor(init?: Partial<UpdateNote>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateNote'; }
    public getMethod() { return 'PATCH'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Delete a Note */
// @ValidateRequest(Validator="HasRole(`MembershipChair`)")
export class DeleteNote implements IReturnVoid, IDeleteDb<Note>
{
    public id: number;

    public constructor(init?: Partial<DeleteNote>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteNote'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

/** @description Create a new School */
// @ValidateRequest(Validator="HasRole(`Committee`)")
export class CreateSchool implements IReturn<IdResponse>, ICreateDb<School>
{
    public description: string;
    public schoolType: SchoolType;
    public gradeLevels: GradeLevels;
    public address: string;
    public city: string;
    public state: State;
    public zipCode: string;

    public constructor(init?: Partial<CreateSchool>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateSchool'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Update a School */
// @ValidateRequest(Validator="HasRole(`Committee`)")
export class UpdateSchool implements IReturn<IdResponse>, IPatchDb<School>
{
    public id: number;
    public description: string;
    public gradeLevels: GradeLevels;
    public address: string;
    public city: string;
    public zipCode: string;

    public constructor(init?: Partial<UpdateSchool>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateSchool'; }
    public getMethod() { return 'PATCH'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Delete a School */
// @ValidateRequest(Validator="HasRole(`MembershipChair`)")
export class DeleteSchool implements IReturnVoid, IDeleteDb<School>
{
    public id: number;

    public constructor(init?: Partial<DeleteSchool>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteSchool'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

/** @description Link a Note to a School */
// @ValidateRequest(Validator="HasRole(`Committee`)")
export class CreateSchoolNote implements IReturn<IdResponse>, ICreateDb<SchoolNote>
{
    public noteId: number;
    public schoolId: number;

    public constructor(init?: Partial<CreateSchoolNote>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateSchoolNote'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Delete a link of a Note to a School */
// @ValidateRequest(Validator="HasRole(`MembershipChair`)")
export class DeleteSchoolNote implements IReturnVoid, IDeleteDb<SchoolNote>
{
    public id: number;

    public constructor(init?: Partial<DeleteSchoolNote>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteSchoolNote'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

/** @description Create a new Unit */
// @ValidateRequest(Validator="HasRole(`MembershipChair`)")
export class CreateUnit implements IReturn<IdResponse>, ICreateDb<Unit>
{
    public sex: Sex;
    public type: UnitType;
    // @Validate(Validator="GreaterThan(0)")
    public number: number;

    public districtId: number;

    public constructor(init?: Partial<CreateUnit>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateUnit'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Update an existing Unit */
// @ValidateRequest(Validator="HasRole(`MembershipChair`)")
export class UpdateUnit implements IReturn<IdResponse>, IPatchDb<Unit>
{
    public id: number;
    public sex: Sex;
    public type: UnitType;
    // @Validate(Validator="GreaterThan(0)")
    public number: number;

    public districtId: number;

    public constructor(init?: Partial<UpdateUnit>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateUnit'; }
    public getMethod() { return 'PATCH'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Delete a Unit */
// @ValidateRequest(Validator="HasRole(`MembershipChair`)")
export class DeleteUnit implements IReturnVoid, IDeleteDb<Unit>
{
    public id: number;

    public constructor(init?: Partial<DeleteUnit>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteUnit'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

/** @description Link a Note to a Unit */
// @ValidateRequest(Validator="HasRole(`Committee`)")
export class CreateUnitNote implements IReturn<IdResponse>, ICreateDb<UnitNote>
{
    public noteId: number;
    public unitId: number;

    public constructor(init?: Partial<CreateUnitNote>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateUnitNote'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Delete a link of a Note to a Unit */
// @ValidateRequest(Validator="HasRole(`MembershipChair`)")
export class DeleteUnitNote implements IReturnVoid, IDeleteDb<UnitNote>
{
    public id: number;

    public constructor(init?: Partial<DeleteUnitNote>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteUnitNote'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

/** @description Link a School to a Unit */
// @ValidateRequest(Validator="HasRole(`Committee`)")
export class CreateUnitSchool implements IReturn<IdResponse>, ICreateDb<UnitSchool>
{
    public unitId: number;
    public schoolId: number;

    public constructor(init?: Partial<CreateUnitSchool>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateUnitSchool'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Delete a link of a School to a Unit */
// @ValidateRequest(Validator="HasRole(`MembershipChair`)")
export class DeleteUnitSchool implements IReturnVoid, IDeleteDb<UnitSchool>
{
    public id: number;

    public constructor(init?: Partial<DeleteUnitSchool>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteUnitSchool'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

