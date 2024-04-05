using Microsoft.EntityFrameworkCore;
using SimplySkip.Helpers;
using SimplySkip.Interfaces;
using SimplySkip.Models;

namespace SimplySkip.Services
{
    public class AuditLogService : IAuditLogService
    {
        private readonly SSDbContext _ssDbContext;

        public AuditLogService(SSDbContext ssDbContext)
        {
            _ssDbContext = ssDbContext;
        }

        public async Task<Response<AuditLog>> CreateAuditLog(AuditLog auditLog)
        {
            _ssDbContext.AuditLogs.Add(auditLog);
            await _ssDbContext.SaveChangesAsync();

            return Response<AuditLog>.Success(auditLog);
        }

        public async Task<Response<List<AuditLog>>> GetAllAuditLogs()
        {
            var auditLogs = await _ssDbContext.AuditLogs.ToListAsync();

            return Response<List<AuditLog>>.Success(auditLogs);
        }

        public async Task<Response<AuditLog>> GetAuditLogById(int id)
        {
            var auditLog = await _ssDbContext.AuditLogs.Where(al => al.Id == id).FirstOrDefaultAsync();

            if (auditLog == null)
            {
                return Response<AuditLog>.Fail(404, "Audit Log Not Found");
            }

            return Response<AuditLog>.Success(auditLog);
        }

        public async Task<Response<AuditLog>> GetLatestAuditLogByUserId(int userId)
        {
            var auditLog = await _ssDbContext.AuditLogs
                                                .Where(al => al.UserId == userId)
                                                .OrderByDescending(al => al.Timestamp)
                                                .FirstOrDefaultAsync();

            if (auditLog == null)
            {
                return Response<AuditLog>.Fail(404, "Audit Log Not Found");
            }

            return Response<AuditLog>.Success(auditLog);
        }
    }
}