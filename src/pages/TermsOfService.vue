<template>
  <div  class="d-flex justify-center align-center h-full">
    <v-row>
      <v-col cols="12" md="10" sm="12"  offset-md="1" offset-sm="0" class="mb-10">
        <div class="text-center text-h4 py-10 primary--text text-shadow">Magnifiscent500 Terms of Service</div>
        <v-card v-for="(term, i) in terms" :key="i" class="my-5" flat>
          <v-card-title>{{ term.title }}</v-card-title>
          <v-card-text class="tracking-wide">
            <div class="grey--text text--lighten-4">{{ term.subtitle }}</div>
            <div class="grey--text text--lighten-2">{{ term.content }}</div>
            <div class="grey--text text--lighten-4">{{ term.subtitle2 }}</div>
            <div class="grey--text text--lighten-2">{{ term.content2 }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({
    terms: [
      {
        title: 'Agreement',
        content: 'By using this site or by clicking "I agree" to this Agreement, you ("INDEPENDENT DISTRIBUTOR") signify your agreement to these terms and conditions. If you do not agree to this Agreement please do not use this site and do not click "I agree". Please check this Agreement periodically for changes as the owner of this site ("Magnifiscent500/Company") reserves the right to revise this Agreement. In the event of a change to this Agreement, your continued use of this site following the posting of any changes constitutes acceptance of such changes. The Company reserves the right to terminate an independent distributor’s use of this site at any time without notice and may do so for any breach of this Agreement.'
      },
      {
        title: 'You must be over 18 or older to agree to this agreement and use this site',
        content: 'This Agreement must be completed, understood and agreed to by a person over 18. If a parent or guardian wishes to permit a person under 18 to access this site, he or she should email the Company with his or her explicit permission and acceptance of full legal responsibility. If you are not yet 18 or are accessing this site from any country where this material is prohibited, please exit now as you do not have proper authorization.'
      },
      {
        title: 'Sharing contact details',
        content: 'With this Agreement as an independent distributor of Magnifiscent500, you must share your contact details to your group or co distributors so they will be free to contact you at any time once they needed your cooperation in your team or as a team as part of your responsibility as a registered Magnifiscent500 Independent Distributor.'
      },
      {
        title: 'License to Use this Site',
        content: 'Upon your agreement, Magnifiscent500 hereby grants you a non-exclusive limited license to use this site in strict accordance with the terms and conditions in this Agreement. You agree not to make any false or fraudulent statements as you use this site. You acknowledge and agree that all content and services available on this site are property of the Magnifiscent500 and are protected by copyrights, trademarks, service marks, patents, trade secrets, and other proprietary rights and laws. All rights not expressly granted herein are fully reserved by the Company, its advertisers and licensors. You agree to pay for any and all purchases and services using your name and credit card through this Site, not to challenge any such charges and to pay for all collections and/or attorneys fees resulting from any non-payment.'
      },
      {
        title: 'License Restrictions',
        subtitle: 'USE',
        content: 'Except as may be explicitly permitted, you agree not to save, download, cut and paste, sell, license, rent, lease, modify, distribute, copy, reproduce, transmit, publicly display, publicly perform, publish, adapt, edit, or create derivative works from materials from this site. Systematic retrieval of data or other content from this site to create or compile, directly or indirectly, a collection, database or directory without written permission from the Company is prohibited. In addition, use of the content or materials for any purpose not expressly permitted in this Agreement is prohibited.',
        subtitle2: 'SECURITY',
        content2: 'You agree that if you are issued a Username and Password by the Company, you shall use your best efforts to prevent access to this site through your Username and Password by anyone other than yourself, including but not limited to, keeping such information strictly confidential, notifying the Company immediately if you discover loss or access to such information by an unauthorized party and by using a secure Username and Password not easily guessed by a third party. You agree that you shall not try to reverse assemble, reverse compile, decompile, disassemble, translate or otherwise alter any executable code, contents or materials on or received via this site. You understand that such actions are likely to subject you to serious civil and criminal legal penalties and that the Company shall pursue such penalties to the full extent of the law to protect its rights and the rights of its other licensors.'
      },
      {
        title: 'Errors and Corrections',
        content: 'While we use reasonable efforts to include accurate and current information on our Site, we do not warrant or represent that the Site will be error-free. Data entry errors or other technical problems may sometimes result in inaccurate information being shown. We reserve the right to correct any inaccuracies or typographical errors on our Site, including pricing and availability of services, and shall have no liability for such errors. We may also make improvements and or changes to the Site\'s features, functionality, or content at any time. If you see any information or description you believe to be incorrect, please contact us and we\'ll verify it for you.'
      },
      {
        title: 'Links to Other Websites',
        content: 'Our Site contains links to other websites for your information and convenience. These third-party websites are responsible for, and undertake to maintain, their own site terms of use. We suggest that you carefully review the terms of use of each site you choose to access from our Site.'
      },
      {
        title: 'Independent Distributor\'s License Grant to Site',
        content: 'Except with regard to personal information, all information which you post on this site or communicate to the Company through this site (collectively "Submissions") shall forever be the property of the Company. The Company shall not treat any submission as confidential and shall not incur any liability as a result of any similarities that may appear in future Company services. Without copy, the Company shall have exclusive ownership of all present and future existing rights to any Submission of every kind and nature everywhere. You acknowledge that you are fully responsible for the message, including its legality, reliability, appropriateness, originality and copyright. You hereby represent and warrant that your Submission does not infringe the rights of any third party.'
      },
      {
        title: 'Independent Distributor\'s Conduct',
        content: 'You understand that all information, data, text, software, music, sound, photographs, graphics, video, messages or other materials ("Content"), whether publicly posted or privately transmitted, are the sole responsibility of the person from which such Content originated. This means that you, and not the Magnifiscent500, are entirely responsible for all Content that you upload, make available, post, email or otherwise transmit via the Service. Magnifiscent500 does not control the Content posted via the Service and, as such, does not guarantee the accuracy, integrity or quality of such Content. You understand that by using the Service, you may be exposed to Content that is offensive, indecent or objectionable. Under no circumstances will Magnifiscent500 be liable in any way for any Content, including, but not limited to, any errors or omissions in any Content or for any loss or damage of any kind incurred as a result of the use of any Content posted, emailed, or transmitted via the Service.'
      },
      {
        title: 'Termination',
        content: 'You agree that Magnifiscent500 in its sole discretion, may terminate your user access, registration, password, account (or any part thereof) or use of the Service, and remove and discard any Content within the Service, for any reason, including, without limitation, that you have violated or acted inconsistently with the letter or spirit of the TOS. The company may also in its sole discretion and at any time discontinue providing the Service, or any part thereof, with or without Notice. You agree that any termination of your access to the Service under any provision of this TOS may be effected without prior notice, and acknowledge and agree that Magnifiscent500 may immediately deactivate or delete your account and all related information and files in your account and/or bar any further access to such files or the Service. Further, you agree that Magnifiscent500 shall not be liable to you or any third-party for any termination of your access to the Service.'
      },
      {
        title: 'Dealings with Advertisers',
        content: 'Your correspondence or business dealings with, or participation in promotions of, advertisers found on or through the Service, including payment and delivery of related goods or services, and any other terms, conditions, warranties or representations associated with such dealings, are solely between you and such advertiser. You agree that Magnifiscent500 shall not be responsible or liable for any loss or damage of any sort incurred as the result of any such dealings or as the result of the presence of such advertisers on the Service.'
      },
      {
        title: 'Modifications to Service',
        content: 'The company reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that Magnifiscent500 shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.'
      },
      {
        title: 'Disclaimer of Warranties',
        content: 'The Company, its advertisers and licensors make no representation or warranties about this site, the suitability of the information contained on or received through use of this site, or any service received through this site. All information and use of this site are provided "as is" without warranty of any kind. The Company, advertisers and/or its licensors hereby disclaim all warranties without regards to this site, the information contained or received through use of this site, and any services received through this site, including all express, statutory, and implied warranties of merchantability, fitness for a particular purpose, title and non-infringement. The Company, advertisers and/or its licensors do not warrant that the contents or any information received through this site are accurate, reliable or correct; that this site will be available at any particular time or location; that any defects or errors will be corrected; or that the contents of any information received through this site is free of viruses or other harmful components. Your use of this site is solely at your risk. User agrees that it has relied on no warranties, representations or statements other than in this agreement. Because some jurisdictions do not permit the exclusion of certain warranties, these exclusions may not apply to you but shall apply to the maximum extent permitted by law of your jurisdiction.'
      },
      {
        title: 'Limitation of Liability',
        content: 'Under no circumstances shall the Company, advertisers and/or its licensors be liable for any direct, indirect, punitive, incidental, special, or consequential damages that result from the use or inability to use, this site. This limitation applies whether the alleged liability is based on contract, tort, negligence, strictly liability, or any other basis, even if the company, advertisers and/or its licensors have been advised of the possibility of such damage. Because some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, the Company, advertisers and/or its respective licensors\' liability in such jurisdictions shall be limited to the maximum extent permitted by law of your jurisdiction.'
      },
      {
        title: 'Indemnification',
        content: 'You agree to defend, indemnify, and hold harmless the Company, its advertisers, licensors, subsidiaries and other affiliated companies, and their employees, contractors, officers, agents and directors from all liabilities, claim, and expenses, including attorney\'s fees, that arise from your use of this site, or any services or information from this site, or any violation of this Agreement. The Company reserves the right, at its own expense, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you shall cooperate with the Company in asserting any available defenses.'
      },
      {
        title: 'Legal Compliance',
        content: 'Company may suspend or terminate this Agreement immediately upon receipt of any notice which alleges that User has used this site for any purpose that violates any local, state, federal or law of other nations, including but not limited to the posting of information that may violate third party rights, that may defame a third party, that may be obscene or pornographic, that may harass or assault other, that may violate hacking or other criminal regulations of its agent, officers, directors, contractors or employees. In such event, Company may disclose the Subscriber’s identity and a subpoena or other legal action, and Company shall not be liable for damages or results thereof and User agrees not to bring any action or claim against Company for such disclosure.'
      },
      {
        title: 'Applicable Law',
        content: 'Visitor agrees that the applicable law to be applied shall, in all cases, be that of the state of the Website owner(s).'
      },
      {
        title: 'Data Security',
        content: 'This website takes measures to protect its data that contains information related to you. However, as a consideration for viewing this site or interacting with this site in any manner, you waive all claims of any nature against this site concerning the loss, alteration, or misuse of information. You must assume that it is possible for your personal data to be obtained by others, such as "hackers", and used in an inappropriate manner that may cause you harm and that you agree that the site is not responsible for damages to you.'
      },
      {
        title: 'Miscellaneous',
        content: 'This Agreement incorporates by reference the Site Submission Rules if this site allows posting and posts such Rules. This Agreement constitutes the entire agreement between the parties related to the subject matter thereof, supersedes any prior or contemporaneous (oral, written or electronic) agreement between the parties and shall not be changed except by written agreement signed by an officer of the Company. If any provision of this Agreement is prohibited by law are held to be unenforceable, the remaining provisions hereof shall not be affected, and this Agreement as much as possible under applicable law shall continue in full force and effect as if such unenforceable provision had never constituted a part hereof and the unenforceable provision shall be automatically amended so as to best accomplish the objectives of such unenforceable provision within the limits of applicable law.'
      },
      {
        title: 'Refunds',
        content: 'Our company does not issue refunds for accounts already registered and have activated the activation code and you are responsible for understanding before clicking register button. Please make sure that you’ve carefully read all relevant documentation.'
      },
      {
        title: 'Revisions Without Notice',
        content: 'You may not assume that T.O.S remains the same and you agree to check the T.O.S each time you visit the site for changes. Your continued use of this site always evidences your acceptance of the terms or any modifications.'
      }
    ]
  })
}
</script>