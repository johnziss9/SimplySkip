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
    public class SkipController : ControllerBase
    {
        private readonly ISkipService _skipService;

        public SkipController(ISkipService skipService)
        {
            _skipService = skipService;
        }

        [HttpPost]
        public async Task<ActionResult<Skip>> Create(Skip skip)
        {
            return ResponseHelper.HandleErrorAndReturn(await _skipService.CreateSkip(skip));
        }

        [HttpGet]
        public async Task<ActionResult<List<Skip>>> GetAll()
        {
            return ResponseHelper.HandleErrorAndReturn(await _skipService.GetAllSkips());
        }

        [HttpGet("pagination")]
        public async Task<ActionResult<SkipPaginatedList<Skip>>> GetPaginated([FromQuery] int page = 1, [FromQuery] string? filter = null)
        {
            if (page < 1) page = 1;
            const int pageSize = 500;

            return ResponseHelper.HandleErrorAndReturn(await _skipService.GetSkipsWithPagination(page, pageSize, filter));
        }

        [HttpGet("available")]
        public async Task<ActionResult<List<Skip>>> GetAvailable()
        {
            return ResponseHelper.HandleErrorAndReturn(await _skipService.GetAvailableSkips());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Skip>> Get(int id)
        {
            return ResponseHelper.HandleErrorAndReturn(await _skipService.GetSkipById(id));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Skip>> Update(int id, Skip skip)
        {
            return ResponseHelper.HandleErrorAndReturn(await _skipService.UpdateSkip(id, skip));
        }
    }
}