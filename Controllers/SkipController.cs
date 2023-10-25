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
    }
}