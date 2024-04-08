using SimplySkip.Helpers;
using SimplySkip.Models;

namespace SimplySkip.Interfaces
{
    public interface IAuditLogService
    {
         Task<Response<AuditLog>> CreateAuditLog(AuditLog auditLog);

         Task<Response<List<AuditLog>>> GetAllAuditLogs();

         Task<Response<AuditLog>> GetAuditLogById(int id);

         Task<Response<AuditLog>> GetLatestAuditLogByUserId(string userId);
    }
}