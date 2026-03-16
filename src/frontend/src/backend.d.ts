import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ReportId = bigint;
export interface AnalysisReport {
    reportUrl: string;
    userId: Principal;
    feedback: Array<string>;
    timestamp: bigint;
    videoUrl: string;
    shotType: string;
}
export interface UserProfile {
    username: string;
    email: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyReports(): Promise<Array<AnalysisReport>>;
    getReport(reportId: ReportId): Promise<AnalysisReport>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitAnalysis(videoUrl: string, reportUrl: string, shotType: string, feedback: Array<string>): Promise<void>;
}
