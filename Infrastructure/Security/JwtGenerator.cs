using System.Collections.Generic;
using System.Security.Claims;
using Application.Interfaces;
using Domain;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;

namespace Infrastructure.Security
{
    public class JwtGenerator : IJwtGenerator
    {
        public string CreateToken(AppUser user)
        {
            var claim = new List<Claim>{
                new Claim(JwtRegisteredClaimNames.NameId,user.UserName)
            };

            var key=new SymmetricSecurityKey(Encoding.UTF8.GetBytes("supper secret key"));
            var creds= new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor= new SecurityTokenDescriptor
            {
                Subject=new ClaimsIdentity(claim),
                Expires=DateTime.Now.AddDays(7),
                SigningCredentials=creds
            };
            var tokenHandler=new JwtSecurityTokenHandler();
            var token=tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}