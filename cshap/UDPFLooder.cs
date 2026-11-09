using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.Json;

var client = new UdpClient();
client.Connect("192.168.1.61", 11000);

var data = new
{
    start = new { X = 76.2f, Y = 0.1f, Z = 78.9f },
    end = new { X = -72.3f, Y = 0.1f, Z = -72.7f }
};
byte[] bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(data));

var sw = System.Diagnostics.Stopwatch.StartNew();
int sent = 0;

Parallel.For(0, 8, i =>
{
    while (true)
    {
        client.Send(bytes, bytes.Length);
        Interlocked.Increment(ref sent);
    }
});

while (true)
{
    Console.WriteLine($"Sent: {sent} packets/s");
    sent = 0;
    Thread.Sleep(1000);
}