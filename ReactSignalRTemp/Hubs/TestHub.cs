using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactSignalRTemp.Hubs
{
    public class TestHub : Hub
    {
        public async Task SendSignal(object data)
        {
            Console.WriteLine(data);
            await Clients.All.SendAsync("HeyYou", data);
        }
    }
}
