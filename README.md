# Garbage Classifier

> 웹캠 기반 실시간 쓰레기 분류 시스템 - PyTorch와 ResNet-50을 활용한 재활용 쓰레기 자동 분류 프로젝트

[![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=PyTorch&logoColor=white)]()
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white)]()
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)]()
[![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=flat-square&logo=MariaDB&logoColor=white)]()

## 프로젝트 개요
Garbage Classifier는 실시간 웹캠 영상을 통해 재활용 쓰레기를 자동으로 분류하고 데이터를 관리하는 시스템입니다. PyTorch와 ResNet-50 아키텍처를 기반으로 한 딥러닝 모델을 사용하여 높은 정확도의 쓰레기 분류를 실현하였으며, 분류된 데이터는 자동으로 데이터베이스에 저장되어 관리됩니다.

## 시스템 구성도
```text
Frontend (React + TypeScript)
          ↕
    Backend (Node.js)
          ↕
AI Model (Python + PyTorch)
          ↕
   Database (MariaDB)
```

## 주요 기능
- **실시간 쓰레기 분류**
  - 웹캠을 통한 실시간 이미지 캡처
  - ResNet-50 기반 딥러닝 모델을 통한 쓰레기 종류 분류
  - 분류 결과의 실시간 표시

- **자동 데이터 관리**
  - 분류된 쓰레기 데이터 자동 DB 저장
  - 분류 이력 관리 및 통계 분석
  - 데이터 시각화 대시보드 제공

## 기술 스택
### Frontend
- React
- TypeScript

### Backend
- Node.js
- Python

### AI Model
- PyTorch
- ResNet-50

### Database
- MariaDB

## ER 다이어그램
<img width="614" height="580" alt="스크린샷 2024-11-11 002959" src="https://github.com/user-attachments/assets/634c8f84-035d-49ec-b66a-b5ba157be906" />

## 와이어 프레임
<img width="1248" height="587" alt="스크린샷 2024-11-11 002922" src="https://github.com/user-attachments/assets/faefedd1-f149-4564-a2db-3bc131e0d931" />

## 시스템 환경도
<img width="1806" height="924" alt="스크린샷 2024-11-16 231054" src="https://github.com/user-attachments/assets/9cd20422-6527-40ef-9d08-cc66022ce86a" />

## 데이터셋
모델 학습에 사용된 데이터셋:
1. [TrashNet Dataset](https://huggingface.co/datasets/garythung/trashnet)
  - 쓰레기 이미지 데이터셋
  - 6개 카테고리의 재활용 쓰레기 이미지 포함

2. [AI Hub 생활폐기물 이미지 데이터셋](https://aihub.or.kr/aihubdata/data/view.do?currMenu=115&topMenu=100&aihubDataSe=realm&dataSetSn=140)
  - 한국의 실제 생활폐기물 이미지
  - 다양한 각도와 조건의 쓰레기 이미지 포함


## 학습 과정
<img width="296" height="806" alt="스크린샷 2024-11-06 114326" src="https://github.com/user-attachments/assets/a8bed2e2-1b02-41e3-8867-e313d5e9a998" />
<img width="317" height="817" alt="스크린샷 2024-11-06 114355" src="https://github.com/user-attachments/assets/90900f57-78e1-4aa5-9b1a-e1e671f2826d" />

## 메인 페이지
<img width="1878" height="1007" alt="스크린샷 2024-11-06 061148" src="https://github.com/user-attachments/assets/bbe78f78-603a-4173-b7a5-26ebe8c4570b" />

## 로그인 및 회원가입
### 로그인 화면
<img width="1872" height="1004" alt="스크린샷 2024-11-06 061400" src="https://github.com/user-attachments/assets/a8d882d2-a81d-4fe4-a45e-525f25427512" />

### 회원가입 화면
<img width="1876" height="1007" alt="스크린샷 2024-11-06 061341" src="https://github.com/user-attachments/assets/48a80924-8747-44b1-919c-af16e2969ce3" />

## 대시보드
### 메인 대시보드
![대시보드 메인](Images/Dashboard_photo.png)

### 통계 화면
<img width="1868" height="1005" alt="스크린샷 2024-11-06 061504" src="https://github.com/user-attachments/assets/c7b37f46-13f9-476b-b32b-d801817c8ef2" />
<img width="1875" height="999" alt="스크린샷 2024-11-06 061555" src="https://github.com/user-attachments/assets/24e298e4-59ee-48f0-b58b-e35886a4ec12" />

## 작동 화면
<img width="1917" height="1076" alt="스크린샷 2024-11-12 235642" src="https://github.com/user-attachments/assets/2a9f41f7-46b4-4e34-ab93-7881a31574d1" />


