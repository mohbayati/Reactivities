using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ErroeHandlingMiddleWare
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErroeHandlingMiddleWare> _logger;
        public ErroeHandlingMiddleWare(RequestDelegate next, ILogger<ErroeHandlingMiddleWare> logger)
        {
            _logger = logger;
            _next = next;
        }
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HanddleExceptionAsync(context, ex, _logger);
            }
        }

        private async Task HanddleExceptionAsync(HttpContext context, Exception ex, ILogger<ErroeHandlingMiddleWare> logger)
        {
            object errors = null;
            switch (ex)
            {
                case RestException re:
                    logger.LogError(ex, "Rest Error");
                    errors = re.Error;
                    context.Response.StatusCode = (int)re.Code;
                    break;
                case Exception e:
                    logger.LogError(ex, "Server Error");
                    errors = string.IsNullOrEmpty(e.Message) ? "Error" : e.Message;
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;

            }
            context.Response.ContentType = "application/json";
            if (errors != null)
            {
                var result = JsonSerializer.Serialize(new
                {
                    errors
                });
                await context.Response.WriteAsync(result);
            }
        }
    }
}