using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ReactSignalRTemp.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactSignalRTemp.Controllers
{
    [ApiController]
    [Route("api/testhub")]
    public class SignalController : Controller
    {
        private IHubContext<TestHub> _hub;

        public void ReactSignalRTemp(IHubContext<TestHub> testHub)
        {
            _hub = testHub;
        }

        [HttpPost]
        public async Task<IActionResult> Create(TempObject temp)
        {
            await _hub.Clients.All.SendAsync("SendSignal", temp.Input);

            return Ok();
        }
    }

    public class TempObject
    {
        public virtual string Input { get; set; }
    }

}
