using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimplySkip.Helpers;
using SimplySkip.Interfaces;
using SimplySkip.Models;

namespace SimplySkip.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class AuditLogController
    {
        private readonly IAuditLogService _auditLogService;

        public AuditLogController(IAuditLogService auditLogService)
        {
            _auditLogService = auditLogService;
        }

        [HttpPost]
        public async Task<ActionResult<AuditLog>> Create(AuditLog auditLog)
        {
            return ResponseHelper.HandleErrorAndReturn(await _auditLogService.CreateAuditLog(auditLog));
        }

        [HttpGet]
        public async Task<ActionResult<List<AuditLog>>> GetAll()
        {
            return ResponseHelper.HandleErrorAndReturn(await _auditLogService.GetAllAuditLogs());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AuditLog>> Get(int id)
        {
            return ResponseHelper.HandleErrorAndReturn(await _auditLogService.GetAuditLogById(id));
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<AuditLog>> GetByUserId(string id)
        {
            return ResponseHelper.HandleErrorAndReturn(await _auditLogService.GetLatestAuditLogByUserId(id));
        }
    }
}