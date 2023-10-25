using Microsoft.AspNetCore.Mvc;
using SimplySkip.Helpers;
using SimplySkip.Interfaces;
using SimplySkip.Models;

namespace SimplySkip.Controllers
{
    [ApiController]
    [Route("[controller]")]
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
            return ResponseHelper.HandleErrorAndReturn(await _skipService.AddSkip(skip));
        }

        [HttpGet]
        public async Task<ActionResult<List<Skip>>> GetAll()
        {
            return ResponseHelper.HandleErrorAndReturn(await _skipService.GetAllSkips());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Skip>> Get(int id)
        {
            return ResponseHelper.HandleErrorAndReturn(await _skipService.GetSkipById(id));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Skip>> Update(int id, Skip skip)
        {
            return ResponseHelper.HandleErrorAndReturn(await _skipService.DeleteSkip(id, skip));
        }
    }
}