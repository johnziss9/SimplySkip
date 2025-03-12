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
    public class UpdateController
    {
        private readonly IUpdateService _updateService;

        public UpdateController(IUpdateService updateService)
        {
            _updateService = updateService;
        }

        [HttpPost]
        public async Task<ActionResult<Update>> Create(Update update)
        {
            return ResponseHelper.HandleErrorAndReturn(await _updateService.CreateUpdate(update));
        }

        [HttpGet]
        public async Task<ActionResult<List<Update>>> GetAll()
        {
            return ResponseHelper.HandleErrorAndReturn(await _updateService.GetAllUpdates());
        }
    }
}