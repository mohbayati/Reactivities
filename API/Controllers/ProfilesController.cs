﻿using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{username}")]
        public async Task<ActionResult<Profile>> Get(string username)
        {
            return await Mediator.Send(new Details.Query { Username = username } );
        }
        [HttpPut]
        public async Task<ActionResult<Unit>> Put(Edit.Command command)
        {
            return await Mediator.Send(command);
        }
    }
}
