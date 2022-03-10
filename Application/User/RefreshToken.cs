using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.User
{
    public class RefreshToken
    {
        public class Command : IRequest<User>
        {
            public string RefreshToken { get; set; }
        }
        public class Handler : IRequestHandler<Command, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IUserAccess _userAccess;

            public Handler(UserManager<AppUser> userManager,
             IJwtGenerator jwtGenerator, IUserAccess userAccess)
            {
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _userAccess = userAccess;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {

                var user = await _userManager.FindByNameAsync(_userAccess.GetCurrentUsername());

                var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == request.RefreshToken);

                if (oldToken != null && !oldToken.IsActive) throw new
                    RestException(HttpStatusCode.Unauthorized);

                if (oldToken != null)
                {
                    oldToken.Revoked = DateTime.UtcNow;
                }

                var newRefreshToken = _jwtGenerator.GenerateRefreshToken();
                user.RefreshTokens.Add(newRefreshToken);
                await _userManager.UpdateAsync(user);
                return new User(user, _jwtGenerator, newRefreshToken.Token);
            }
        }

    }
}