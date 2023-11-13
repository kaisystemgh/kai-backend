import { Injectable, UseGuards } from '@nestjs/common';
import { RecoverCajaPasswordDto } from './common/dtos/RecoverCajaPassword.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { IsAuthenticatedMiddleware } from './common/middlewares/IsAuthenticated.middleware';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}
  getHello(): string {
    return 'Hello World!';
  }

  @UseGuards(IsAuthenticatedMiddleware)
  recoverCajaPassword(data: RecoverCajaPasswordDto) {
    return this.mailerService.sendMail({
      to: [data.defaultEmail, data.email],
      from: process.env.GMAIL_ACCOUNT,
      subject: 'CAJA | contraseña',
      html: `<div style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
      <div dir="ltr" class="es-wrapper-color" lang="es" style="background-color:#FAFAFA"><!--[if gte mso 9]>
        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#fafafa"></v:fill>
        </v:background>
        <![endif]-->
       <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">
         <tr>
          <td valign="top" style="padding:0;Margin:0">
           <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
             <tr>
              <td align="center" style="padding:0;Margin:0">
               <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;padding-top:15px;padding-left:20px;padding-right:20px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                       <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://fbnomte.stripocdn.email/content/guids/CABINET_d07254b62d80c9df91c041a075e2248a09451f80385e032ea63323fc17c20381/images/kailogo.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="256" height="256"></td>
                         </tr>
                         <tr>
                          <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px"><h1 style="Margin:0;line-height:55px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:46px;font-style:normal;font-weight:bold;color:#333333">CAJA | Contraseña</h1></td>
                         </tr>
                         <tr>
                          <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:24px;color:#333333;font-size:16px">Tu contraseña para la sección de caja en la cuenta <u>${data.email}</u> es: <strong></strong><strong>${data.password}</strong></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:24px;color:#333333;font-size:16px"><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:24px;color:#333333;font-size:16px">Gracias por usar KAI.</p></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
      </div>
     </div>`,
    });
  }
}
