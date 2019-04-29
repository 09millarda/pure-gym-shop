using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PureGym.Store.Azure;
using PureGym.Store.Common;
using PureGym.Store.Data;
using PureGym.Store.Data.Sql.Helpers;

namespace PureGym.Store.Web
{
    public class Startup
    {
        public Startup()
        {
            Configuration = CommonConfiguration.Config;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddDbServices(Configuration);
            services.AddAzureServices(Configuration);

            services.AddLogging(builder =>
            {
                builder.AddSeq(Configuration.GetSection("Seq"));
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseCors(ConfigureCorsPolicy);
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.Use(async (context, next) =>
            {
                await next();
                var path = context.Request.Path.Value;

                if (!path.StartsWith("/api") && !Path.HasExtension(path))
                {
                    context.Request.Path = "/index.html";
                    await next();
                }
            });
            app.UseStaticFiles();
            app.UseMvc();
        }

        private void ConfigureCorsPolicy(CorsPolicyBuilder builder)
        {
            builder.AllowAnyHeader();
            builder.AllowAnyMethod();
            builder.AllowCredentials();
            builder.AllowAnyOrigin();
        }
    }
}
