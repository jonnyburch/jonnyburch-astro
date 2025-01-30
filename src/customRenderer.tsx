import type { RenderFunctionInput } from "astro-opengraph-images";
import React from "react";

export async function customOgMediaLayout({ title, description }: RenderFunctionInput): Promise<React.ReactNode> {

  return (
    <div style={{
      backgroundColor: "#f7e0d4",
      display: "flex",
      flexDirection: "column",
      padding: "4rem",
      width: "100%",
      height: "100%"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        flexGrow: 1,
        width: "80%",
        fontFamily: "Inter"
      }}>
        <span style={{
          fontSize: "60px",
          color: "rgb(5, 66, 54)",
          fontWeight: "700",
          textAlign: "left",
          paddingBottom: "2px",
          marginBottom: "1rem",
          lineHeight: "1.1",
          textDecoration: "underline",
          textDecorationColor: "rgb(5, 66, 54)",
          textDecorationThickness: "2px"
        }}>
          {title}
        </span>
        <div style={{
          fontSize: "30px",
          color: "rgb(5, 66, 54)",
          textAlign: "left"
        }}>
          {description}
        </div>
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        fontFamily: "Inter"
      }}>
        <div style={{
          fontSize: "30px",
          color: "rgba(5, 66, 54, 0.8)",
          textAlign: "left",
          fontWeight: "400"
        }}>
          Jonny Burch
        </div>
      </div>
    </div>
  );
}