'use client'
import styles from "./page.module.css";
import dynamic from "next/dynamic";

const ClientTable = dynamic(() => import('../components/ClientTable'), { loading: () => <p>Loading table...</p> });
import { mockData, tableConfig } from '../data/mockData';
import { useEffect, useState } from "react";

export default function Home() {

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Astuto Table Demo</h1>
        <div className={styles.tableContainer}>
          <ClientTable data={mockData} config={tableConfig} />
        </div>
      </div>
    </main>
  );
}
