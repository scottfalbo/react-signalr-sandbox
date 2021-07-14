using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ReactSignalRTemp.Hubs
{
    public class TestHub : Hub
    {
        /// <summary>
        /// Main page basic chat server
        /// </summary>
        /// <param name="data"> object {user, input, log} </param>
        public async Task SendSignal(object data)
        {
            TestObject result = JsonSerializer.Deserialize<TestObject>(data.ToString());
            result.Log.Add($"{result.User}: {result.Input}");


            await Clients.All.SendAsync("HeyYou", result.Log);
        }

        /// <summary>
        /// High Card Hub
        /// </summary>
        /// <param name="gameData"></param>
        /// <returns></returns>
        public async Task HighCardSignal(object gameData)
        {
            await Clients.All.SendAsync("HighCard", gameData);
        }

    }

    class TestObject
    {
        public string User { get; set; }
        public string Input { get; set; }
        public List<string> Log { get; set; }
    }
}
