import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type AnalysisReport = {
    videoUrl : Text;
    reportUrl : Text;
    shotType : Text;
    feedback : [Text];
    timestamp : Int;
    userId : Principal;
  };

  public type UserProfile = {
    username : Text;
    email : Text;
  };

  type ReportId = Nat;

  var nextReportId = 0;
  let reports = Map.empty<ReportId, AnalysisReport>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Analysis Report Management
  public shared ({ caller }) func submitAnalysis(videoUrl : Text, reportUrl : Text, shotType : Text, feedback : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit analysis");
    };

    let report : AnalysisReport = {
      videoUrl;
      reportUrl;
      shotType;
      feedback;
      timestamp = 0; // Core library does not provide Int.now(), using 0 as placeholder
      userId = caller;
    };

    let reportId = nextReportId;
    nextReportId += 1;

    reports.add(reportId, report);
  };

  public query ({ caller }) func getMyReports() : async [AnalysisReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view reports");
    };

    let myReports = List.empty<AnalysisReport>();
    for ((_, report) in reports.entries()) {
      if (report.userId == caller) {
        myReports.add(report);
      };
    };

    myReports.toArray();
  };

  public query ({ caller }) func getReport(reportId : ReportId) : async AnalysisReport {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view reports");
    };

    switch (reports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?report) {
        // Verify ownership or admin access
        if (report.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own reports");
        };
        report;
      };
    };
  };
};
