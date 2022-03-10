using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.User
{
    public class CurrentUser
    {
        public class Query : IRequest<User>
        {
        }
        public class Handler : IRequestHandler<Query, User>
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

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {

                var user = await _userManager.FindByNameAsync(_userAccess.GetCurrentUsername());
                var refreshToken = _jwtGenerator.GenerateRefreshToken();
                user.RefreshTokens.Add(refreshToken);
                await _userManager.UpdateAsync(user);
                return new User(user, _jwtGenerator, refreshToken.Token);
            }
        }
    }
}