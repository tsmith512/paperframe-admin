import React from "react";
import Head from "next/head";

export default function About(props) {
  return (
    <div className="container">
      <Head>
        <title>About | Paperframe</title>
      </Head>
      <h2>About Paperframe</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit augue
        elit, at suscipit justo rhoncus nec. Quisque ac orci felis. Maecenas sed nibh
        pellentesque metus congue dignissim quis vitae urna. Integer faucibus massa
        risus, ac commodo odio tristique pretium. Pellentesque tempus in ante commodo
        vulputate. Morbi viverra placerat dui, vitae suscipit dui malesuada vel.
        Pellentesque posuere lacus in leo lacinia, vitae ultrices eros placerat. Ut nec
        massa dignissim, tincidunt sapien at, semper tellus. Sed tincidunt lorem et
        lacinia ornare.
      </p>
    </div>
  );
}
