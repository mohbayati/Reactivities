using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command : IRequest
        {
            public string DisplayName { get; set; }
            public string Bio { get; set; }
        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                
            }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccess _userAccess;
            public Handler(DataContext context,IUserAccess userAccess)
            {
                _context = context;
                _userAccess = userAccess;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                //logic here
                var user = await _context.Users.SingleOrDefaultAsync(x=>x.UserName==
                _userAccess.GetCurrentUsername());

                user.DisplayName = request.DisplayName;
                user.Bio = request.Bio ?? user.Bio;

                var sucess = await _context.SaveChangesAsync() > 0;
                if (sucess)
                    return Unit.Value;
                throw new Exception("Problem Saving Change");
            }
        }
    }
}
