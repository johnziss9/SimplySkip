using Microsoft.AspNetCore.Mvc;
using SimplySkip.Interfaces;

namespace SimplySkip.Controllers
{
    public class SkipController : ControllerBase
    {
        private readonly ISkipService _skipService;

        public SkipController(ISkipService skipService)
        {
            _skipService = skipService;
        }
    }
}